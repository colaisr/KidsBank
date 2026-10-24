/**
 * Общий ввод-вывод хуков перед shell-командой агента: Claude Code (PreToolUse, matcher Bash,
 * блок = exit 2 и текст в stderr) и Cursor (beforeShellExecution, ответ JSON `permission`).
 * Используют guard-archive.mjs и guard-push.mjs.
 */

import { realpathSync } from "node:fs";
import { pathToFileURL } from "node:url";

export function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });
}

/** Claude Code: { tool_input: { command }, cwd }; Cursor: { command, cwd, workspace_roots }. */
export function parseHookInput(input) {
  const isCursor = typeof input.command === "string" && !input.tool_input;
  const command = isCursor ? input.command : (input.tool_input?.command ?? "");
  const root =
    process.env.CLAUDE_PROJECT_DIR || input.workspace_roots?.[0] || input.cwd || process.cwd();
  return { isCursor, command, root };
}

export function allow(isCursor) {
  if (isCursor) process.stdout.write(JSON.stringify({ permission: "allow" }));
  process.exit(0);
}

export function deny(isCursor, message) {
  if (isCursor) {
    process.stdout.write(
      JSON.stringify({ permission: "deny", userMessage: message, agentMessage: message }),
    );
    process.exit(0);
  }
  process.stderr.write(`${message}\n`);
  process.exit(2);
}

/**
 * Запущен ли модуль напрямую (а не импортом из selftest). import.meta.url — realpath в
 * URL-кодировке, поэтому сравниваем с тем же видом argv[1] (пробелы, кириллица, symlink).
 */
export function isEntry(metaUrl) {
  try {
    return metaUrl === pathToFileURL(realpathSync(process.argv[1])).href;
  } catch {
    return false;
  }
}

/** Прочитать JSON хука из stdin и передать обработчику; чужой формат команде не мешает. */
export function runHook(metaUrl, handler) {
  if (!isEntry(metaUrl)) return;
  readStdin().then((raw) => {
    let input = {};
    try {
      input = JSON.parse(raw || "{}");
    } catch {
      // не наш формат — не мешаем команде
    }
    handler(input);
  });
}
