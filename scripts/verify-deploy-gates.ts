/**
 * Замок на деплой preview: пока есть активный OpenSpec change, выкатывать можно только
 * при четырёх зелёных гейтах (spec-verify, code-reviewer, security-reviewer, qa).
 * Активных changes нет — деплой разрешён.
 *
 * В KidsBank push в main ничего не выкатывает, деплой ручной (npm run deploy:preview),
 * поэтому замок стоит в скриптах деплоя, а не на push и не в CI.
 *
 * Usage: npm run verify:deploy-gates
 */

import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { validateChangeGates } from "./change-gates";

const root = process.cwd();

/** Slug'и активных changes: папки в openspec/changes, кроме archive. */
export function activeChanges(repoRoot: string): string[] {
  const dir = join(repoRoot, "openspec/changes");
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== "archive")
    .map((e) => e.name)
    .sort();
}

function main(): number {
  const slugs = activeChanges(root);
  if (slugs.length === 0) {
    console.log("verify:deploy-gates OK — активных changes нет");
    return 0;
  }

  let failed = false;
  for (const slug of slugs) {
    for (const { gate, result } of validateChangeGates(root, slug)) {
      if (result.ok) {
        console.log(`  ok    ${slug}: ${gate}`);
        if (result.warning) console.warn(`  WARN  ${slug}: ${gate}: ${result.warning}`);
      } else {
        failed = true;
        console.error(`  FAIL  ${slug}: ${gate}: ${result.detail}`);
      }
    }
  }
  if (failed) {
    console.error(
      "verify:deploy-gates FAIL — деплой остановлен. /verify-change <slug>, затем снова деплой. " +
        "Если change не должен мешать, заархивируйте его или запишите owner-waiver в гейт.",
    );
    return 1;
  }
  console.log(`verify:deploy-gates OK — ${slugs.join(", ")}`);
  return 0;
}

// импорт из selftest не должен запускать проверку
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  try {
    process.exit(main());
  } catch (err) {
    // fail-closed: сломанная проверка не должна молча пропускать деплой
    console.error(`verify:deploy-gates ERROR — ${(err as Error).message}`);
    process.exit(1);
  }
}
