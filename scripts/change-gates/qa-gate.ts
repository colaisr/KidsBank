import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  checkWaiverNote,
  isDocsOnlyPath,
  isIsoDate,
  loadGateJson,
  type GateCheckResult,
} from "./shared";

/**
 * Гейт локального qa (стадия 3 шага verify, гейт 2). Пост-деплойный qa сюда не пишется.
 * Формат — openspec/changes/add-verify-step/specs/change-verify-step/spec.md.
 */

const SKIP_REASONS = ["docs-only", "owner-waiver"] as const;

/** Без этого прогона pass не принимается. */
// В KidsBank нет lint, а `npm run build` = `tsc -b && vite build` и покрывает типы.
const REQUIRED_CHECKS = ["npm run build"];

/** scope_files гейта code-reviewer — единственный источник «что в change код, а что доки». */
function codeReviewerScope(repoRoot: string, changeSlug: string): string[] | null {
  const path = join(repoRoot, "openspec/changes", changeSlug, "gates/code-reviewer.json");
  if (!existsSync(path)) return null;
  try {
    const g = JSON.parse(readFileSync(path, "utf-8")) as { scope_files?: unknown };
    return Array.isArray(g.scope_files) && g.scope_files.every((f) => typeof f === "string")
      ? (g.scope_files as string[])
      : null;
  } catch {
    return null;
  }
}

export function validateQaGate(repoRoot: string, changeSlug: string): GateCheckResult {
  const loaded = loadGateJson(repoRoot, changeSlug, "qa.json", "run /verify-change (qa stage) first");
  if (!loaded.ok) return loaded;
  const g = loaded.raw;

  if (g.verdict !== "pass" && g.verdict !== "fail" && g.verdict !== "skip") {
    return { ok: false, detail: "verdict must be pass, fail, or skip" };
  }
  if (!isIsoDate(g.reviewed_at)) {
    return { ok: false, detail: "reviewed_at must be an ISO date string" };
  }
  if (typeof g.round !== "number" || !Number.isInteger(g.round) || g.round < 0) {
    return { ok: false, detail: "round must be a non-negative integer" };
  }

  if (g.verdict === "skip") {
    if (!SKIP_REASONS.includes(g.skip_reason as (typeof SKIP_REASONS)[number])) {
      return { ok: false, detail: `skip requires skip_reason: ${SKIP_REASONS.join(" | ")}` };
    }
    if (g.skip_reason === "owner-waiver") {
      const bad = checkWaiverNote(g);
      if (bad) return { ok: false, detail: bad };
      return { ok: true, warning: `owner-waiver (qa): ${String(g.waiver_note).trim()}` };
    }
    const scope = codeReviewerScope(repoRoot, changeSlug);
    if (!scope) {
      return {
        ok: false,
        detail: "docs-only skip: cannot cross-check without a valid gates/code-reviewer.json",
      };
    }
    const code = scope.find((f) => !isDocsOnlyPath(f, changeSlug));
    if (code) {
      return { ok: false, detail: `docs-only skip but code-reviewer scope has code: ${code}` };
    }
    return { ok: true };
  }

  const checks = g.checks;
  if (!Array.isArray(checks) || checks.length === 0 || checks.some((c) => typeof c !== "string")) {
    return { ok: false, detail: "checks must be a non-empty array of commands that were run" };
  }

  if (g.verdict === "fail") {
    return { ok: false, detail: "qa verdict is fail — fix in the main chat and re-run /verify-change" };
  }

  // точное совпадение команды или её начало: `npm run build:xyz` не засчитывается как build
  const ran = (cmd: string) =>
    (checks as string[])
      .flatMap((c) => c.split("&&"))
      .some((part) => {
        const t = part.trim();
        return t === cmd || t.startsWith(`${cmd} `);
      });
  const missing = REQUIRED_CHECKS.filter((cmd) => !ran(cmd));
  if (missing.length > 0) {
    return { ok: false, detail: `pass without required checks: ${missing.join(", ")}` };
  }
  return { ok: true };
}
