#!/usr/bin/env node
/**
 * Restore KidsBank-specific edits that `openspec init` / `openspec update` wipe out.
 *
 * Usage:
 *   npm run openspec:restore            # insert missing blocks, bring back custom files
 *   npm run openspec:restore -- --check # exit 1 and list what is missing; writes nothing
 *
 * Reference texts live in scripts/openspec-inserts/ (source of truth):
 *   archive-header.md      — «KidsBank — гейты и Archive feedback loop» line at the top of archive
 *   archive-step-4b.md     — step «4b. KidsBank checkpoint» before «5. Perform the archive»
 *   propose-tasks-tail.md  — «KidsBank — tasks.md must end with» before **Guardrails** in propose
 *   files/**               — project files missing from the OpenSpec profile, copied as-is
 *
 * Idempotent: a second run changes nothing. If an anchor is gone (OpenSpec changed the
 * generated layout), the script stops with exit 1 instead of guessing a place.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const insertsDir = path.join(root, 'scripts', 'openspec-inserts');
const filesDir = path.join(insertsDir, 'files');
const check = process.argv.includes('--check');

const ref = (name) => fs.readFileSync(path.join(insertsDir, name), 'utf8');
const header = ref('archive-header.md').replace(/\n+$/, '');
const step4b = ref('archive-step-4b.md');
const proposeTail = ref('propose-tasks-tail.md');

const ARCHIVE_INTRO = '\n---\n\nArchive a completed change in the experimental workflow.\n\n';
const PERFORM_ARCHIVE = '5. **Perform the archive**';
const GUARDRAILS = '**Guardrails**\n';

/** Each insert: `text` goes right after (or before) the first occurrence of `anchor`. */
const inserts = [
  ...[
    '.cursor/commands/opsx-archive.md',
    '.claude/commands/opsx/archive.md',
    '.cursor/skills/openspec-archive-change/SKILL.md',
    '.claude/skills/openspec-archive-change/SKILL.md',
  ].flatMap((file) => [
    // Body, not frontmatter: inside the skill `description` it breaks the YAML.
    { file, id: 'archive-header', anchor: ARCHIVE_INTRO, where: 'after', text: `${header}\n\n` },
    { file, id: 'archive-step-4b', anchor: PERFORM_ARCHIVE, where: 'before', text: step4b },
  ]),
  ...['.cursor/skills/openspec-propose/SKILL.md', '.claude/skills/openspec-propose/SKILL.md'].map(
    (file) => ({ file, id: 'propose-tasks-tail', anchor: GUARDRAILS, where: 'before', text: proposeTail }),
  ),
];

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? listFiles(p) : [p];
  });
}

const problems = [];
const changed = [];

for (const [file, group] of Object.entries(Object.groupBy(inserts, (i) => i.file))) {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) {
    problems.push(`${file}: file is missing (run openspec update first)`);
    continue;
  }
  let content = fs.readFileSync(abs, 'utf8');
  let dirty = false;
  for (const { id, anchor, where, text } of group) {
    const block = where === 'after' ? anchor + text : text + anchor;
    if (content.includes(block)) continue;
    if (content.includes(text.trim())) {
      problems.push(`${file}: ${id} is present but not next to its anchor — fix by hand`);
      continue;
    }
    if (!content.includes(anchor)) {
      problems.push(`${file}: ${id} anchor not found ${JSON.stringify(anchor.trim())} — OpenSpec layout changed, update scripts/openspec-restore.mjs`);
      continue;
    }
    if (check) {
      problems.push(`${file}: ${id} is missing`);
      continue;
    }
    content = content.replace(anchor, block);
    dirty = true;
    changed.push(`${file}: inserted ${id}`);
  }
  if (dirty) fs.writeFileSync(abs, content);
}

for (const src of listFiles(filesDir)) {
  const rel = path.relative(filesDir, src);
  const dest = path.join(root, rel);
  const want = fs.readFileSync(src);
  const exists = fs.existsSync(dest);
  if (exists && fs.readFileSync(dest).equals(want)) continue;
  if (check) {
    problems.push(`${rel}: ${exists ? 'differs from scripts/openspec-inserts/files' : 'is missing'}`);
    continue;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, want);
  changed.push(`${rel}: ${exists ? 'overwritten from reference' : 'restored'}`);
}

for (const line of changed) console.log(`  + ${line}`);
if (problems.length) {
  console.error(`openspec:restore${check ? ' --check' : ''} FAIL`);
  for (const line of problems) console.error(`  - ${line}`);
  process.exit(1);
}
console.log(
  check
    ? 'openspec:restore --check OK — all KidsBank inserts and custom files are in place'
    : `openspec:restore OK — ${changed.length ? `${changed.length} fix(es) applied` : 'nothing to do'}`,
);
