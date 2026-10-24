import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCodeReviewerGate } from "./code-reviewer-gate";
import { validateQaGate } from "./qa-gate";
import { validateSecurityReviewerGate } from "./security-reviewer-gate";
import { isValidSlug, type GateCheckResult } from "./shared";
import { validateSpecVerifyGate } from "./spec-verify-gate";

export type GateName = "spec-verify" | "code-reviewer" | "security-reviewer" | "qa";

/** Порядок цепочки шага verify: спека → ревью (параллельно) → qa. */
export const GATE_NAMES: GateName[] = ["spec-verify", "code-reviewer", "security-reviewer", "qa"];

/** `tasks` — не гейт, а проверка режима --archive: все задачи change закрыты. */
export type CheckName = GateName | "tasks";

export type NamedGateResult = { gate: CheckName; result: GateCheckResult };

export type ValidateOptions = {
  /** Перед archive: дополнительно ни одной `- [ ]` в tasks.md. */
  archive?: boolean;
};

const VALIDATORS: Record<GateName, (repoRoot: string, changeSlug: string) => GateCheckResult> = {
  "spec-verify": validateSpecVerifyGate,
  "code-reviewer": validateCodeReviewerGate,
  "security-reviewer": validateSecurityReviewerGate,
  qa: validateQaGate,
};

/** Ступень гейта в цепочке: ревьюеры на одной ступени, их взаимный порядок не важен. */
const STAGE: Record<GateName, number> = {
  "spec-verify": 0,
  "code-reviewer": 1,
  "security-reviewer": 1,
  qa: 2,
};

/** Время pass-гейта; skip и fail в сравнении порядка не участвуют. */
function passedAt(repoRoot: string, changeSlug: string, gate: GateName): number | null {
  try {
    const raw = JSON.parse(
      readFileSync(join(repoRoot, "openspec/changes", changeSlug, "gates", `${gate}.json`), "utf-8"),
    ) as { verdict?: unknown; reviewed_at?: unknown };
    if (raw.verdict !== "pass" || typeof raw.reviewed_at !== "string") return null;
    const t = Date.parse(raw.reviewed_at);
    return Number.isNaN(t) ? null : t;
  } catch {
    return null;
  }
}

/**
 * Гейт ниже по цепочке не может быть старше гейта выше: если после ревью заново
 * прогнали spec-verify (значит, правили код), ревью и qa устарели.
 */
function checkOrder(repoRoot: string, changeSlug: string, results: NamedGateResult[]): void {
  const times = new Map<GateName, number>();
  for (const gate of GATE_NAMES) {
    const t = passedAt(repoRoot, changeSlug, gate);
    if (t !== null) times.set(gate, t);
  }
  for (const r of results) {
    if (r.gate === "tasks" || !r.result.ok) continue;
    const mine = times.get(r.gate);
    if (mine === undefined) continue;
    const newer = GATE_NAMES.find(
      (up) => STAGE[up] < STAGE[r.gate as GateName] && (times.get(up) ?? -Infinity) > mine,
    );
    if (newer) {
      r.result = {
        ok: false,
        detail: `older than ${newer} (code changed after this gate) — re-run this stage and everything after it via /verify-change`,
      };
    }
  }
}

/** Незакрытые задачи tasks.md: перед archive их быть не должно. */
function checkTasks(repoRoot: string, changeSlug: string): GateCheckResult {
  if (!isValidSlug(changeSlug)) {
    return { ok: false, detail: `invalid change slug: ${changeSlug}` };
  }
  const path = join(repoRoot, "openspec/changes", changeSlug, "tasks.md");
  if (!existsSync(path)) return { ok: true, warning: "no tasks.md — nothing to check" };
  const open = readFileSync(path, "utf-8")
    .split("\n")
    .filter((line) => /^\s*- \[ \]/.test(line))
    .map((line) => line.trim());
  if (open.length > 0) {
    return {
      ok: false,
      detail: `${open.length} unchecked task(s) in tasks.md:\n        ${open.join("\n        ")}`,
    };
  }
  return { ok: true };
}

export function validateChangeGates(
  repoRoot: string,
  changeSlug: string,
  only?: GateName,
  options: ValidateOptions = {},
): NamedGateResult[] {
  const names = only ? [only] : GATE_NAMES;
  const results: NamedGateResult[] = names.map((gate) => ({
    gate,
    result: VALIDATORS[gate](repoRoot, changeSlug),
  }));
  if (!only) checkOrder(repoRoot, changeSlug, results);
  if (options.archive) results.push({ gate: "tasks", result: checkTasks(repoRoot, changeSlug) });
  return results;
}
