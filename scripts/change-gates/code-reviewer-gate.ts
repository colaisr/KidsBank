import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  firstDirectoryInScope,
  firstInvalidScopePath,
  isDocsOnlyPath,
  isValidSlug,
  normalizePath,
  type GateCheckResult,
} from "./shared";

export type { GateCheckResult } from "./shared";

export type CodeReviewerVerdict = "pass" | "fail" | "skip";

export type SkipReason = "docs-only" | "meloch" | "owner-waiver";

export type CodeReviewerGateFile = {
  verdict: CodeReviewerVerdict;
  change: string;
  scope_files: string[];
  round: number;
  reviewed_at: string;
  skip_reason?: SkipReason;
  waiver_note?: string;
};

const SKIP_REASONS: SkipReason[] = ["docs-only", "meloch", "owner-waiver"];

function parseGate(
  raw: string,
): GateCheckResult | { ok: true; gate: CodeReviewerGateFile } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return { ok: false, detail: "gates/code-reviewer.json is not valid JSON" };
  }
  if (!parsed || typeof parsed !== "object") {
    return { ok: false, detail: "gate file must be a JSON object" };
  }
  const g = parsed as Record<string, unknown>;
  const verdict = g.verdict;
  const change = g.change;
  const scope_files = g.scope_files;
  const round = g.round;
  const reviewed_at = g.reviewed_at;

  if (verdict !== "pass" && verdict !== "fail" && verdict !== "skip") {
    return { ok: false, detail: "verdict must be pass, fail, or skip" };
  }
  if (typeof change !== "string" || !change.trim()) {
    return { ok: false, detail: "change must be a non-empty string" };
  }
  if (!Array.isArray(scope_files) || scope_files.some((f) => typeof f !== "string")) {
    return { ok: false, detail: "scope_files must be an array of strings" };
  }
  if (typeof round !== "number" || !Number.isInteger(round) || round < 0) {
    return { ok: false, detail: "round must be a non-negative integer" };
  }
  const badPath = firstInvalidScopePath(scope_files as string[]);
  if (badPath) {
    return { ok: false, detail: `scope_files: недопустимый путь — ${badPath}` };
  }
  if (typeof reviewed_at !== "string" || !reviewed_at.trim()) {
    return { ok: false, detail: "reviewed_at must be an ISO date string" };
  }

  const gate: CodeReviewerGateFile = {
    verdict,
    change: change.trim(),
    scope_files: scope_files.map(normalizePath),
    round,
    reviewed_at: reviewed_at.trim(),
  };

  if (verdict === "skip") {
    const skip_reason = g.skip_reason;
    if (!SKIP_REASONS.includes(skip_reason as SkipReason)) {
      return {
        ok: false,
        detail: `skip requires skip_reason: ${SKIP_REASONS.join(" | ")}`,
      };
    }
    gate.skip_reason = skip_reason as SkipReason;
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

function validateSkipScope(gate: CodeReviewerGateFile): GateCheckResult {
  if (gate.skip_reason === "owner-waiver") {
    return { ok: true, warning: `owner-waiver (code-reviewer): ${gate.waiver_note}` };
  }
  if (gate.scope_files.length === 0) {
    return { ok: false, detail: "skip requires non-empty scope_files" };
  }
  if (gate.skip_reason === "meloch") {
    if (gate.scope_files.length === 0 || gate.scope_files.length > 2) {
      return { ok: false, detail: "meloch skip requires 1–2 scope_files" };
    }
    return { ok: true };
  }

  for (const file of gate.scope_files) {
    if (!isDocsOnlyPath(file, gate.change)) {
      return {
        ok: false,
        detail: `skip (${gate.skip_reason}) invalid for path: ${file}`,
      };
    }
  }
  return { ok: true };
}

export function validateCodeReviewerGate(
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

  const gatePath = join(changeDir, "gates/code-reviewer.json");
  if (!existsSync(gatePath)) {
    return {
      ok: false,
      detail: "missing gates/code-reviewer.json — run /code-reviewer first",
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
          "code review fail at round 2 or later — escalate approach with owner before more qa",
      };
    }
    return {
      ok: false,
      detail: "code-reviewer verdict is fail — fix and re-run /code-reviewer",
    };
  }

  if (gate.round > 2) {
    return {
      ok: false,
      detail: "round above 2 — maximum is 2 rounds, escalate to owner",
    };
  }

  if (gate.verdict === "pass") {
    if (gate.scope_files.length === 0) {
      return { ok: false, detail: "pass requires non-empty scope_files" };
    }
    return { ok: true };
  }

  return validateSkipScope(gate);
}
