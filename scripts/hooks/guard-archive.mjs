#!/usr/bin/env node
/**
 * Замок на archive OpenSpec change (change add-verify-step, D5).
 *
 * Хук перед shell-командой агента: Claude Code (PreToolUse, matcher Bash) и Cursor
 * (beforeShellExecution). Если команда переносит openspec/changes/<slug> в
 * openspec/changes/archive/ (mv, git mv) или запускает `openspec archive <slug>`,
 * запускает `verify:change-gates --change <slug> --archive` и блокирует команду при fail.
 * Любая другая команда пропускается сразу, без запуска tsx.
 */

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { allow, deny, parseHookInput, runHook } from "./hook-io.mjs";

const SLUG = "[a-z0-9][a-z0-9-]*";

/** slug, если команда архивирует change; null — команда не про archive. */
export function archivedSlug(command) {
  const cli = command.match(new RegExp(`\\bopenspec\\s+archive\\s+(?:-\\S+\\s+)*["']?(${SLUG})`));
  if (cli) return cli[1];
  if (!/changes\/archive/.test(command) || !/(^|[\s;&|(])(git\s+)?mv\s/.test(command)) return null;
  for (const m of command.matchAll(new RegExp(`openspec/changes/(${SLUG})`, "g"))) {
    if (m[1] !== "archive") return m[1];
  }
  return "";
}

function main(input) {
  const { isCursor, command, root } = parseHookInput(input);

  const slug = archivedSlug(command);
  if (slug === null) allow(isCursor);
  if (slug === "") {
    deny(
      isCursor,
      "archive заблокирован: не удалось определить slug change в команде. " +
        "Перенесите openspec/changes/<slug> явным путём.",
    );
  }

  const tsx = join(root, "node_modules/.bin/tsx");
  const run = spawnSync(
    existsSync(tsx) ? tsx : "npx",
    existsSync(tsx)
      ? ["scripts/verify-change-gates.ts", "--change", slug, "--archive"]
      : ["tsx", "scripts/verify-change-gates.ts", "--change", slug, "--archive"],
    { cwd: root, encoding: "utf8" },
  );
  if (run.status === 0) allow(isCursor);
  deny(
    isCursor,
    `archive ${slug} заблокирован: verify:change-gates --archive не прошёл.\n` +
      `${run.stdout ?? ""}${run.stderr ?? ""}`.trimEnd() +
      "\nСначала /verify-change и закрыть задачи в tasks.md.",
  );
}

runHook(import.meta.url, main);
