import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  firstDirectoryInScope,
  firstInvalidScopePath,
  isDocsOnlyPath,
  isValidSlug,
  matchKey,
  normalizePath,
  type GateCheckResult,
} from "./shared";

export type SecurityVerdict = "pass" | "fail" | "skip";
export type SecurityDepth = "light" | "deep";
export type SecuritySkipReason = "docs-only" | "owner-waiver";

export type SecurityReviewerGateFile = {
  verdict: SecurityVerdict;
  change: string;
  depth?: SecurityDepth;
  scope_files: string[];
  round: number;
  reviewed_at: string;
  skip_reason?: SecuritySkipReason;
  waiver_note?: string;
};

const SKIP_REASONS: SecuritySkipReason[] = ["docs-only", "owner-waiver"];

/**
 * Пути, где ошибка безопасности стоит дорого: для них обязателен deep.
 * Глубину определяет скрипт, а не сам ревьюер — иначе её можно занизить «для удобства».
 * Список синхронизирован с docs/SECURITY-REVIEW.md § «Глубина проверки».
 */
const DEEP_PATH_PATTERNS: { pattern: RegExp; label: string }[] = [
  // Все шаблоны — в нижнем регистре: сравнение идёт по matchKey() (регистр не различается).
  { pattern: /^deploy\//, label: "deploy/** (VPS, nginx, прокси чата с ключом Polza)" },
  { pattern: /^scripts\/.*\.sh$/, label: "scripts/*.sh (деплой на VPS по SSH)" },
  { pattern: /^scripts\/change-gates\//, label: "scripts/change-gates/** (сами гейты)" },
  { pattern: /^scripts\/verify-/, label: "scripts/verify-* (проверки и гейты)" },
  { pattern: /^scripts\/hooks\//, label: "scripts/hooks/** (хуки агентов)" },
  {
    pattern: /(^|\/)package(-lock)?\.json$/,
    label: "package.json / lock (скрипты, зависимости)",
  },
  {
    pattern: /^(tsconfig[^/]*\.json|vite\.config\.[cm]?[jt]s|\.npmrc|\.mcp\.json)$/,
    label: "конфиги сборки (tsconfig, vite.config, .npmrc, .mcp.json)",
  },
  { pattern: /^index\.html$/, label: "index.html (скрипты, meta, CSP)" },
  { pattern: /^\.husky\//, label: ".husky/** (git-хуки)" },
  { pattern: /^openspec\/config\.yaml$/, label: "openspec/config.yaml (правила гейтов)" },
  { pattern: /^\.claude\//, label: ".claude/** (агенты, команды, настройки)" },
  { pattern: /^\.cursor\//, label: ".cursor/** (команды, скиллы, хуки, mcp)" },
  { pattern: /^\.github\//, label: ".github/** (workflow)" },
  { pattern: /(^|\/)\.env/, label: ".env*" },
  {
    pattern: /^docs\/security-review\.md$/,
    label: "docs/SECURITY-REVIEW.md (правила проверки)",
  },
  { pattern: /^docs\/review\.md$/, label: "docs/REVIEW.md (правила code review)" },
  {
    pattern: /^docs\/roles\/(security-reviewer|code-reviewer)\.md$/,
    label: "роли ревьюеров",
  },
];

/** Признаки по содержимому: файл может лежать в «нейтральной» папке, но делать опасное. */
const DEEP_CONTENT_PATTERNS: { pattern: RegExp; label: string }[] = [
  {
    pattern: /dangerouslySetInnerHTML|\binnerHTML\s*=|document\.write/,
    label: "прямая вставка HTML",
  },
  {
    pattern: /\beval\s*\(|\bnew\s+Function\s*\(|\bFunction\s*\(/,
    label: "eval / Function",
  },
  {
    pattern: /\/api\/kidsbank\b/,
    label: "обращение к серверному прокси (чат с моделью, ключ на сервере)",
  },
  {
    pattern: /\bpostMessage\s*\(|addEventListener\(\s*["'`]message["'`]/,
    label: "межоконные сообщения (postMessage)",
  },
  {
    pattern: /getUserMedia|navigator\.mediaDevices|navigator\.geolocation/,
    label: "доступ к камере / геолокации (инвариант: QR-демо без getUserMedia)",
  },
  { pattern: /<iframe\b|\.srcdoc\s*=/, label: "iframe / srcdoc" },
  {
    pattern: /(api[_-]?key|secret|token|password)\s*[:=]\s*["'`][^"'`\s]{12,}/i,
    label: "похоже на секрет в коде",
  },
];

/**
 * Пути «целостности процесса»: правки правил, ролей и инвариантов никогда не считаются «просто документацией».
 * Для них docs-only skip недопустим (см. docs/SECURITY-REVIEW.md § «Глубина проверки»).
 */
const PROCESS_INTEGRITY_PATTERNS: RegExp[] = [
  /^docs\/security-review\.md$/,
  /^docs\/review\.md$/,
  /^docs\/roles\//,
  /^docs\/invariants\.md$/,
  /^agents\.md$/,
  /^claude\.md$/,
];

/** docs-only для security: обычная документация, но не файлы самого процесса безопасности. */
export function isDocsOnlyForSecurity(file: string, changeSlug: string): boolean {
  if (!isDocsOnlyPath(file, changeSlug)) return false;
  const key = matchKey(file);
  return !PROCESS_INTEGRITY_PATTERNS.some((re) => re.test(key));
}

const MAX_CONTENT_BYTES = 512 * 1024;

export function requiredSecurityDepth(
  repoRoot: string,
  scopeFiles: string[],
  changeSlug = "",
): { depth: SecurityDepth; reasons: string[] } {
  const reasons: string[] = [];

  for (const raw of scopeFiles) {
    const file = normalizePath(raw);
    const key = matchKey(raw);

    for (const { pattern, label } of DEEP_PATH_PATTERNS) {
      if (pattern.test(key)) reasons.push(`${file}: ${label}`);
    }

    // Документация (кроме файлов процесса) по содержимому не сканируется: примеры кода в ней — не код.
    if (isDocsOnlyPath(file, changeSlug)) continue;

    const abs = join(repoRoot, file);
    try {
      const st = statSync(abs);
      if (!st.isFile()) {
        // fail-closed: не обычный файл (устройство, сокет) не просканирован
        reasons.push(`${file}: не обычный файл, не просканирован`);
        continue;
      }
      if (st.size > MAX_CONTENT_BYTES) {
        // fail-closed: файл не просканирован — значит deep
        reasons.push(
          `${file}: файл больше ${MAX_CONTENT_BYTES / 1024} КБ, не просканирован`,
        );
        continue;
      }
      const content = readFileSync(abs, "utf-8");
      for (const { pattern, label } of DEEP_CONTENT_PATTERNS) {
        if (pattern.test(content)) reasons.push(`${file}: ${label}`);
      }
    } catch (err) {
      // файл удалён в этом change — сканировать нечего; любая другая ошибка → deep
      if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
      reasons.push(`${file}: файл не удалось прочитать, не просканирован`);
    }
  }

  return { depth: reasons.length > 0 ? "deep" : "light", reasons };
}

function parseGate(
  raw: string,
): GateCheckResult | { ok: true; gate: SecurityReviewerGateFile } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return { ok: false, detail: "gates/security-reviewer.json is not valid JSON" };
  }
  if (!parsed || typeof parsed !== "object") {
    return { ok: false, detail: "gate file must be a JSON object" };
  }
  const g = parsed as Record<string, unknown>;
  const { verdict, change, scope_files, round, reviewed_at, depth } = g;

  if (verdict !== "pass" && verdict !== "fail" && verdict !== "skip") {
    return { ok: false, detail: "verdict must be pass, fail, or skip" };
  }
  if (typeof change !== "string" || !change.trim()) {
    return { ok: false, detail: "change must be a non-empty string" };
  }
  if (!Array.isArray(scope_files) || scope_files.some((f) => typeof f !== "string")) {
    return { ok: false, detail: "scope_files must be an array of strings" };
  }
  const badPath = firstInvalidScopePath(scope_files as string[]);
  if (badPath) {
    return { ok: false, detail: `scope_files: недопустимый путь — ${badPath}` };
  }
  if (typeof round !== "number" || !Number.isInteger(round) || round < 0) {
    return { ok: false, detail: "round must be a non-negative integer" };
  }
  if (typeof reviewed_at !== "string" || !reviewed_at.trim()) {
    return { ok: false, detail: "reviewed_at must be an ISO date string" };
  }

  const gate: SecurityReviewerGateFile = {
    verdict,
    change: change.trim(),
    scope_files: scope_files.map(normalizePath),
    round,
    reviewed_at: reviewed_at.trim(),
  };

  if (verdict !== "skip") {
    if (depth !== "light" && depth !== "deep") {
      return { ok: false, detail: "pass/fail requires depth: light | deep" };
    }
    gate.depth = depth;
  }

  if (verdict === "skip") {
    const skip_reason = g.skip_reason;
    if (!SKIP_REASONS.includes(skip_reason as SecuritySkipReason)) {
      return {
        ok: false,
        detail: `skip requires skip_reason: ${SKIP_REASONS.join(" | ")}`,
      };
    }
    gate.skip_reason = skip_reason as SecuritySkipReason;
    if (skip_reason === "owner-waiver") {
      const note = g.waiver_note;
      if (typeof note !== "string" || note.trim().length < 10) {
        return {
          ok: false,
          detail: "owner-waiver requires waiver_note (min 10 characters)",
        };
      }
      gate.waiver_note = note.trim();
    }
  }

  return { ok: true, gate };
}

/** scope_files code-reviewer из его gate (мягкое чтение: чужой файл не валидируем здесь). */
function readCodeReviewerScope(changeDir: string): string[] | null {
  const p = join(changeDir, "gates/code-reviewer.json");
  if (!existsSync(p)) return null;
  try {
    const g = JSON.parse(readFileSync(p, "utf-8")) as { scope_files?: unknown };
    if (!Array.isArray(g.scope_files)) return null;
    const files = g.scope_files.filter((f): f is string => typeof f === "string");
    if (firstInvalidScopePath(files)) return null;
    return files.map(normalizePath);
  } catch {
    return null;
  }
}

export function validateSecurityReviewerGate(
  repoRoot: string,
  changeSlug: string,
): GateCheckResult {
  if (!isValidSlug(changeSlug)) {
    return { ok: false, detail: `invalid change slug: ${changeSlug}` };
  }
  const changeDir = join(repoRoot, "openspec/changes", changeSlug);
  if (!existsSync(changeDir)) {
    return {
      ok: false,
      detail: `active change not found: openspec/changes/${changeSlug}`,
    };
  }

  const gatePath = join(changeDir, "gates/security-reviewer.json");
  if (!existsSync(gatePath)) {
    return {
      ok: false,
      detail: "missing gates/security-reviewer.json — run /security-reviewer first",
    };
  }

  const parsed = parseGate(readFileSync(gatePath, "utf-8"));
  if (!parsed.ok) return parsed;
  if (!("gate" in parsed)) {
    return { ok: false, detail: "internal gate parse error" };
  }
  const { gate } = parsed;

  if (gate.change !== changeSlug) {
    return {
      ok: false,
      detail: `gate.change "${gate.change}" does not match --change ${changeSlug}`,
    };
  }

  const dir = firstDirectoryInScope(repoRoot, gate.scope_files);
  if (dir) {
    return {
      ok: false,
      detail: `scope_files must list files, not a directory: ${dir}`,
    };
  }

  if (gate.verdict === "fail") {
    if (gate.round >= 2) {
      return {
        ok: false,
        detail:
          "security review fail at round 2 or later — escalate to owner (owner may fix approach or issue an owner-waiver)",
      };
    }
    return {
      ok: false,
      detail:
        "security-reviewer verdict is fail — fix findings and re-run /security-reviewer",
    };
  }

  if (gate.round > 2) {
    return {
      ok: false,
      detail: "round above 2 — maximum is 2 rounds, escalate to owner",
    };
  }

  if (gate.verdict === "skip") {
    if (gate.skip_reason === "owner-waiver") {
      return { ok: true, warning: `owner-waiver (security): ${gate.waiver_note}` };
    }
    if (gate.scope_files.length === 0) {
      return { ok: false, detail: "skip requires non-empty scope_files" };
    }
    for (const file of gate.scope_files) {
      if (!isDocsOnlyForSecurity(file, gate.change)) {
        return {
          ok: false,
          detail: `skip (docs-only) invalid for path: ${file} — code and security-process files always need at least a light review`,
        };
      }
    }
    // docs-only skip не должен прятать код, который заявлен в code-reviewer gate
    const crScope = readCodeReviewerScope(changeDir);
    if (!crScope) {
      return {
        ok: false,
        detail:
          "gates/code-reviewer.json missing or unreadable — cannot confirm that docs-only skip hides no code",
      };
    }
    const hidden = crScope.filter((f) => !isDocsOnlyForSecurity(f, gate.change));
    if (hidden.length > 0) {
      return {
        ok: false,
        detail: `docs-only skip while code-reviewer scope has code: ${hidden[0]}`,
      };
    }
    return { ok: true };
  }

  // pass
  if (gate.scope_files.length === 0) {
    return { ok: false, detail: "pass requires non-empty scope_files" };
  }

  const crScope = readCodeReviewerScope(changeDir);
  if (!crScope) {
    return {
      ok: false,
      detail:
        "gates/code-reviewer.json missing or unreadable — cannot cross-check scope_files; run /code-reviewer",
    };
  }
  const covered = new Set(gate.scope_files.map(matchKey));
  const missing = crScope.filter(
    (f) => !isDocsOnlyForSecurity(f, gate.change) && !covered.has(matchKey(f)),
  );
  if (missing.length > 0) {
    return {
      ok: false,
      detail: `security scope_files misses code file from code-reviewer scope: ${missing[0]}`,
    };
  }

  const required = requiredSecurityDepth(repoRoot, gate.scope_files, gate.change);
  if (required.depth === "deep" && gate.depth !== "deep") {
    return {
      ok: false,
      detail: `depth must be deep (gate says ${gate.depth}); triggers: ${required.reasons
        .slice(0, 3)
        .join("; ")}${required.reasons.length > 3 ? "; …" : ""}`,
    };
  }

  return { ok: true };
}
