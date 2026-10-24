import { checkWaiverNote, isIsoDate, loadGateJson, type GateCheckResult } from "./shared";

/**
 * Гейт сверки спеки с кодом (стадия 1 шага verify, субагент spec-verifier).
 * Формат — openspec/changes/add-verify-step/specs/change-verify-step/spec.md.
 */

export type SpecVerifyVerdict = "pass" | "fail" | "skip";

const SKIP_REASONS = ["meloch", "owner-waiver"] as const;

/** С какого раунда предупреждаем: verify гоняют «до зелёного», лимита нет. */
const MANY_ROUNDS = 3;

function isCount(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 0;
}

export function validateSpecVerifyGate(repoRoot: string, changeSlug: string): GateCheckResult {
  const loaded = loadGateJson(
    repoRoot,
    changeSlug,
    "spec-verify.json",
    "run /verify-change first",
  );
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
      return { ok: true, warning: `owner-waiver (spec-verify): ${String(g.waiver_note).trim()}` };
    }
    return { ok: true, warning: "spec-verify skipped (meloch) — сверка спеки с кодом не проводилась" };
  }

  if (g.round < 1) {
    return { ok: false, detail: "round must be ≥ 1 for pass or fail" };
  }
  const f = g.findings as Record<string, unknown> | undefined;
  if (!f || typeof f !== "object" || !isCount(f.critical) || !isCount(f.warning) || !isCount(f.suggestion)) {
    return {
      ok: false,
      detail: "findings must have integer counts critical, warning, suggestion (≥ 0)",
    };
  }

  if (g.verdict === "fail") {
    return {
      ok: false,
      detail: `spec-verify verdict is fail (critical ${f.critical}) — fix in the main chat and re-run /verify-change`,
    };
  }
  if (f.critical > 0) {
    return { ok: false, detail: `pass with ${f.critical} critical finding(s) — critical must be 0` };
  }
  if (g.round >= MANY_ROUNDS) {
    return {
      ok: true,
      warning: `spec-verify passed on round ${g.round} — стоит перечитать спеку: возможно, она расходится с задачей`,
    };
  }
  return { ok: true };
}
