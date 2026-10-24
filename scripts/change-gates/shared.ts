import { existsSync, readFileSync, statSync } from "node:fs";
import { join, posix } from "node:path";

export type GateCheckResult =
  | { ok: true; warning?: string }
  | { ok: false; detail: string };

/** slug активного change: только kebab-case, без путей. */
export function isValidSlug(slug: string): boolean {
  // `archive` — каталог заархивированных changes, а не change: старые архивы не перепроверяем
  return /^[a-z0-9][a-z0-9-]*$/.test(slug) && slug !== "archive";
}

/**
 * Канонический вид пути из gate JSON: слэши `/`, без `./`, `//`, `/./` и `x/../`.
 * Регистр сохраняется (нужен для чтения файла на Linux); для сравнения — `matchKey`.
 */
export function normalizePath(p: string): string {
  return posix.normalize(p.trim().replace(/\\/g, "/")).replace(/^\.\//, "");
}

/** Ключ для сравнения и проверки по шаблонам: регистр не различаем (macOS и Windows нечувствительны). */
export function matchKey(p: string): string {
  return normalizePath(p).toLowerCase();
}

/**
 * Путь в scope_files должен быть относительным путём внутри репозитория.
 * Возвращает причину отказа или null. Без этого `docs/../deploy/x.sh` выглядел бы как документация.
 */
export function invalidScopePath(raw: string): string | null {
  if (raw.includes("\0")) return "путь содержит NUL";
  const unified = raw.trim().replace(/\\/g, "/");
  if (!unified) return "пустой путь";
  if (unified.startsWith("/") || /^[a-zA-Z]:/.test(unified)) return "абсолютный путь";
  const n = posix.normalize(unified);
  if (n === ".." || n.startsWith("../")) return "путь выходит за пределы репозитория";
  if (unified.split("/").includes(".."))
    return "путь содержит «..» (укажите канонический путь)";
  if (n === ".") return "путь указывает на корень";
  if (unified.endsWith("/")) return "укажите файлы, а не каталог";
  return null;
}

/** Первый некорректный путь из списка: `"<путь>: <причина>"` или null. */
export function firstInvalidScopePath(files: string[]): string | null {
  for (const f of files) {
    const reason = invalidScopePath(f);
    if (reason) return `${f}: ${reason}`;
  }
  return null;
}

/**
 * Пути, которые считаются «не прикладным кодом»: доки, спеки, мета change, контент навыков.
 * Единый allowlist для skip у code-reviewer и security-reviewer.
 */
export function isDocsOnlyPath(file: string, changeSlug: string): boolean {
  const p = matchKey(file);
  const slug = changeSlug.toLowerCase();
  if (/^[^/]+\.md$/.test(p)) return true;
  // Внутри «документных» каталогов разрешены только текстовые форматы: docs/x.ts или x.sh — это код.
  const textual = /\.(md|json|csv|txt|ya?ml)$/.test(p);
  if (p.startsWith("docs/")) return textual;
  // PlanDocs/references держит скриншоты и PDF; svg сюда не входит (это разметка, а не картинка)
  if (p.startsWith("plandocs/")) return textual || /\.(png|jpe?g|webp|pdf)$/.test(p);
  if (p.startsWith(`openspec/changes/${slug}/`)) return textual;
  if (p.startsWith("openspec/specs/")) return p.endsWith(".md");
  return false;
}

/** Каталог, а не файл, в scope_files: по каталогу нельзя посчитать глубину и покрытие. */
export function firstDirectoryInScope(
  repoRoot: string,
  files: string[],
): string | null {
  for (const f of files) {
    try {
      if (statSync(join(repoRoot, normalizePath(f))).isDirectory()) return f;
    } catch (err) {
      // нет файла (удалён в change) — допустимо; иная ошибка доступа — не пропускаем молча
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") return f;
    }
  }
  return null;
}

/**
 * Прочитать `openspec/changes/<slug>/gates/<file>` как JSON-объект.
 * Общие проверки для новых гейтов: slug, активный change, наличие файла, валидный JSON.
 */
export function loadGateJson(
  repoRoot: string,
  changeSlug: string,
  file: string,
  missingHint: string,
): { ok: false; detail: string } | { ok: true; raw: Record<string, unknown> } {
  if (!isValidSlug(changeSlug)) {
    return { ok: false, detail: `invalid change slug: ${changeSlug}` };
  }
  const changeDir = join(repoRoot, "openspec/changes", changeSlug);
  if (!existsSync(changeDir)) {
    return { ok: false, detail: `active change not found: openspec/changes/${changeSlug}` };
  }
  const gatePath = join(changeDir, "gates", file);
  if (!existsSync(gatePath)) {
    return { ok: false, detail: `missing gates/${file} — ${missingHint}` };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(gatePath, "utf-8")) as unknown;
  } catch {
    return { ok: false, detail: `gates/${file} is not valid JSON` };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, detail: "gate file must be a JSON object" };
  }
  const raw = parsed as Record<string, unknown>;
  if (raw.change !== changeSlug) {
    return {
      ok: false,
      detail: `gate.change "${String(raw.change)}" does not match --change ${changeSlug}`,
    };
  }
  return { ok: true, raw };
}

/** Общая проверка skip owner-waiver: заметка владельца не короче 10 символов. */
export function checkWaiverNote(raw: Record<string, unknown>): string | null {
  const note = raw.waiver_note;
  if (typeof note !== "string" || note.trim().length < 10) {
    return "owner-waiver requires waiver_note (min 10 characters)";
  }
  return null;
}

/** reviewed_at — строка, которую понимает Date.parse; иначе порядок гейтов не проверить. */
export function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "" && !Number.isNaN(Date.parse(value));
}
