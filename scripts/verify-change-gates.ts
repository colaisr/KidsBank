/**
 * OpenSpec change gates — шаг verify: spec-verify → code-reviewer ∥ security-reviewer → qa.
 * Usage:
 *   npm run verify:change-gates -- --change <slug>            (перед push: все четыре гейта)
 *   npm run verify:change-gates -- --change <slug> --archive  (перед archive: + все задачи закрыты)
 *   npm run verify:change-gates -- --change <slug> --gate security-reviewer
 */

import { GATE_NAMES, validateChangeGates, type GateName } from "./change-gates";

const root = process.cwd();

function parseArgs(argv: string[]): { change?: string; gate?: string; archive: boolean } {
  let change: string | undefined;
  let gate: string | undefined;
  let archive = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--archive") {
      archive = true;
      continue;
    }
    if (argv[i] === "--change" && argv[i + 1]) {
      change = argv[i + 1];
      i++;
    } else if (argv[i] === "--gate" && argv[i + 1]) {
      gate = argv[i + 1];
      i++;
    }
  }
  return { change, gate, archive };
}

const { change, gate, archive } = parseArgs(process.argv.slice(2));

if (!change) {
  console.error(
    `Usage: npm run verify:change-gates -- --change <slug> [--archive] [--gate ${GATE_NAMES.join("|")}]`,
  );
  process.exit(1);
}

if (gate && !GATE_NAMES.includes(gate as GateName)) {
  console.error(`Unknown --gate "${gate}". Expected: ${GATE_NAMES.join(" | ")}`);
  process.exit(1);
}

const results = validateChangeGates(root, change, gate as GateName | undefined, { archive });
let failed = false;

for (const { gate: name, result } of results) {
  if (result.ok) {
    console.log(`  ok    ${name}`);
    if (result.warning) console.warn(`  WARN  ${name}: ${result.warning}`);
  } else {
    failed = true;
    console.error(`  FAIL  ${name}: ${result.detail}`);
  }
}

if (failed) {
  console.error(`verify:change-gates FAIL — ${change}${archive ? " (archive)" : ""}`);
  process.exit(1);
}

console.log(
  `verify:change-gates OK — ${change}${archive ? " (archive)" : ""} (${results.map((r) => r.gate).join(", ")})`,
);
