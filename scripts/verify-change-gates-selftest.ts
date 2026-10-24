/**
 * Самотест гейтов change (spec-verify, code-reviewer, security-reviewer, qa), режима --archive,
 * замка на деплой и распознавания команды archive в хуке — на временных фикстурах.
 * Usage: npm run verify:change-gates:selftest
 */

import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { validateChangeGates, type CheckName } from "./change-gates";
import { archivedSlug } from "./hooks/guard-archive.mjs";
import { activeChanges } from "./verify-deploy-gates";

const SLUG = "demo-change";
const T0 = "2026-10-24T10:00:00.000Z";
const T1 = "2026-10-24T11:00:00.000Z";
const T2 = "2026-10-24T12:00:00.000Z";

type Gate = Record<string, unknown> | null;
type Fixture = {
  name: string;
  sv?: Gate;
  cr?: Gate;
  sec?: Gate;
  qa?: Gate;
  files?: Record<string, string>;
  tasks?: string;
  archive?: boolean;
  slug?: string;
  expectOk: boolean;
  fail?: { gate: CheckName; includes: string };
  warn?: string;
};

const sv = (o: Gate = {}): Gate => ({
  verdict: "pass", change: SLUG, round: 1, reviewed_at: T0,
  findings: { critical: 0, warning: 0, suggestion: 0 }, ...o,
});
const cr = (o: Gate = {}): Gate => ({
  verdict: "pass", change: SLUG, scope_files: ["src/App.tsx"], round: 1, reviewed_at: T1, ...o,
});
const sec = (o: Gate = {}): Gate => ({
  verdict: "pass", change: SLUG, depth: "light", scope_files: ["src/App.tsx"], round: 1, reviewed_at: T1, ...o,
});
const qa = (o: Gate = {}): Gate => ({
  verdict: "pass", change: SLUG, round: 1, reviewed_at: T2, checks: ["npm run build"], ...o,
});
const docsSkip = (extra: Gate = {}) => ({ verdict: "skip", skip_reason: "docs-only", scope_files: ["docs/a.md"], round: 0, ...extra });

const fixtures: Fixture[] = [
  { name: "все четыре pass → ok", expectOk: true },
  { name: "нет spec-verify", sv: null, expectOk: false, fail: { gate: "spec-verify", includes: "missing gates/spec-verify.json" } },
  { name: "нет code-reviewer", cr: null, expectOk: false, fail: { gate: "code-reviewer", includes: "missing" } },
  { name: "нет security-reviewer", sec: null, expectOk: false, fail: { gate: "security-reviewer", includes: "missing" } },
  { name: "нет qa", qa: null, expectOk: false, fail: { gate: "qa", includes: "missing gates/qa.json" } },
  // spec-verify
  { name: "spec-verify: pass с critical > 0", sv: sv({ findings: { critical: 1, warning: 0, suggestion: 0 } }), expectOk: false, fail: { gate: "spec-verify", includes: "critical must be 0" } },
  { name: "spec-verify: fail блокирует", sv: sv({ verdict: "fail" }), expectOk: false, fail: { gate: "spec-verify", includes: "re-run /verify-change" } },
  { name: "spec-verify: раунд 3 → ok + WARN", sv: sv({ round: 3 }), expectOk: true, warn: "round 3" },
  { name: "spec-verify: owner-waiver без заметки", sv: sv({ verdict: "skip", skip_reason: "owner-waiver", round: 0 }), expectOk: false, fail: { gate: "spec-verify", includes: "waiver_note" } },
  // code-reviewer
  { name: "code-reviewer: fail → чинить", cr: cr({ verdict: "fail" }), expectOk: false, fail: { gate: "code-reviewer", includes: "fix and re-run" } },
  { name: "code-reviewer: fail на раунде 2 → эскалация", cr: cr({ verdict: "fail", round: 2 }), expectOk: false, fail: { gate: "code-reviewer", includes: "escalate" } },
  { name: "code-reviewer: pass на раунде 3 → отказ", cr: cr({ round: 3 }), expectOk: false, fail: { gate: "code-reviewer", includes: "round above 2" } },
  { name: "code-reviewer: meloch на 3 файлах", cr: cr({ verdict: "skip", skip_reason: "meloch", scope_files: ["src/a.ts", "src/b.ts", "src/c.ts"], round: 0 }), expectOk: false, fail: { gate: "code-reviewer", includes: "meloch" } },
  { name: "code-reviewer: docs-only с кодом", cr: cr({ verdict: "skip", skip_reason: "docs-only", scope_files: ["src/a.ts"], round: 0 }), expectOk: false, fail: { gate: "code-reviewer", includes: "invalid for path" } },
  // security: глубина считается скриптом
  { name: "security: deploy/** требует deep", cr: cr({ scope_files: ["deploy/leo-chat/server.mjs"] }), sec: sec({ scope_files: ["deploy/leo-chat/server.mjs"] }), expectOk: false, fail: { gate: "security-reviewer", includes: "depth must be deep" } },
  { name: "security: deploy/** и deep → ok", cr: cr({ scope_files: ["deploy/leo-chat/server.mjs"] }), sec: sec({ scope_files: ["deploy/leo-chat/server.mjs"], depth: "deep" }), expectOk: true },
  { name: "security: scripts/*.sh требует deep", cr: cr({ scope_files: ["scripts/remote-deploy.sh"] }), sec: sec({ scope_files: ["scripts/remote-deploy.sh"] }), expectOk: false, fail: { gate: "security-reviewer", includes: "depth must be deep" } },
  { name: "security: package.json требует deep", cr: cr({ scope_files: ["package.json"] }), sec: sec({ scope_files: ["package.json"] }), expectOk: false, fail: { gate: "security-reviewer", includes: "depth must be deep" } },
  { name: "security: vite.config.ts требует deep", cr: cr({ scope_files: ["vite.config.ts"] }), sec: sec({ scope_files: ["vite.config.ts"] }), expectOk: false, fail: { gate: "security-reviewer", includes: "depth must be deep" } },
  { name: "security: .claude/** требует deep", cr: cr({ scope_files: [".claude/settings.json"] }), sec: sec({ scope_files: [".claude/settings.json"] }), expectOk: false, fail: { gate: "security-reviewer", includes: "depth must be deep" } },
  {
    name: "security: innerHTML в обычном файле требует deep",
    cr: cr({ scope_files: ["src/Foo.tsx"] }), sec: sec({ scope_files: ["src/Foo.tsx"] }),
    files: { "src/Foo.tsx": "el.innerHTML = html;" },
    expectOk: false, fail: { gate: "security-reviewer", includes: "прямая вставка HTML" },
  },
  {
    name: "security: обращение к /api/kidsbank требует deep",
    cr: cr({ scope_files: ["src/chat.ts"] }), sec: sec({ scope_files: ["src/chat.ts"] }),
    files: { "src/chat.ts": "fetch('/api/kidsbank/chat')" },
    expectOk: false, fail: { gate: "security-reviewer", includes: "прокси" },
  },
  {
    name: "security: getUserMedia требует deep",
    cr: cr({ scope_files: ["src/qr.ts"] }), sec: sec({ scope_files: ["src/qr.ts"] }),
    files: { "src/qr.ts": "navigator.mediaDevices.getUserMedia({video:true})" },
    expectOk: false, fail: { gate: "security-reviewer", includes: "камере" },
  },
  {
    name: "security: ключ в коде требует deep",
    cr: cr({ scope_files: ["src/k.ts"] }), sec: sec({ scope_files: ["src/k.ts"] }),
    files: { "src/k.ts": "const apiKey = 'sk_live_abcdefghijklmnop';" },
    expectOk: false, fail: { gate: "security-reviewer", includes: "секрет" },
  },
  { name: "security: обычный src → light ok", files: { "src/App.tsx": "export const A = () => null;" }, expectOk: true },
  { name: "security: scope уже code-reviewer", cr: cr({ scope_files: ["src/a.ts", "src/b.ts"] }), sec: sec({ scope_files: ["src/a.ts"] }), expectOk: false, fail: { gate: "security-reviewer", includes: "misses code file" } },
  { name: "security: docs-only skip прячет код", sec: sec({ ...docsSkip(), depth: undefined }), expectOk: false, fail: { gate: "security-reviewer", includes: "code-reviewer scope has code" } },
  {
    name: "security: docs/roles нельзя пропустить как docs-only",
    cr: cr({ ...docsSkip({ scope_files: ["docs/roles/qa.md"] }) }), sec: sec({ ...docsSkip({ scope_files: ["docs/roles/qa.md"] }), depth: undefined }),
    expectOk: false, fail: { gate: "security-reviewer", includes: "invalid for path" },
  },
  {
    name: "security: PlanDocs/references/*.png — документация",
    cr: cr({ ...docsSkip({ scope_files: ["PlanDocs/references/a.png"] }) }), sec: sec({ ...docsSkip({ scope_files: ["PlanDocs/references/a.png"] }), depth: undefined }),
    qa: qa({ verdict: "skip", skip_reason: "docs-only", checks: undefined, round: 0 }), expectOk: true,
  },
  { name: "security: «..» в scope", sec: sec({ scope_files: ["docs/../deploy/x.sh"] }), expectOk: false, fail: { gate: "security-reviewer", includes: "«..»" } },
  // qa
  { name: "qa: pass без build", qa: qa({ checks: ["npm run dev"] }), expectOk: false, fail: { gate: "qa", includes: "npm run build" } },
  { name: "qa: build:xyz не засчитывается", qa: qa({ checks: ["npm run build:xyz"] }), expectOk: false, fail: { gate: "qa", includes: "npm run build" } },
  { name: "qa: «npm run build && npm run preview» → ok", qa: qa({ checks: ["npm run build && npm run preview"] }), expectOk: true },
  { name: "qa: fail блокирует", qa: qa({ verdict: "fail" }), expectOk: false, fail: { gate: "qa", includes: "qa verdict is fail" } },
  { name: "qa: docs-only skip при коде в scope", qa: qa({ verdict: "skip", skip_reason: "docs-only", checks: undefined, round: 0 }), expectOk: false, fail: { gate: "qa", includes: "code-reviewer scope has code" } },
  // порядок свежести
  { name: "порядок: spec-verify свежее ревью", sv: sv({ reviewed_at: T2 }), qa: qa({ reviewed_at: "2026-10-24T13:00:00.000Z" }), expectOk: false, fail: { gate: "code-reviewer", includes: "older than spec-verify" } },
  { name: "порядок: qa старше ревью", qa: qa({ reviewed_at: T0 }), expectOk: false, fail: { gate: "qa", includes: "older than" } },
  // archive
  { name: "archive: незакрытая задача", tasks: "- [x] 1.1 a\n- [ ] 1.2 b\n", archive: true, expectOk: false, fail: { gate: "tasks", includes: "1.2 b" } },
  { name: "archive: все задачи закрыты", tasks: "- [x] 1.1 a\n", archive: true, expectOk: true },
  { name: "без --archive открытая задача не мешает", tasks: "- [ ] 8.1 archive\n", expectOk: true },
  // slug
  { name: "slug с «..» отклонён", slug: "../../etc", expectOk: false, fail: { gate: "spec-verify", includes: "invalid change slug" } },
  { name: "slug «archive» отклонён", slug: "archive", expectOk: false, fail: { gate: "spec-verify", includes: "invalid change slug" } },
];

function writeJson(path: string, value: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(value, null, 2));
}

let failures = 0;
let total = 0;
const report = (name: string, ok: boolean, note = "") => {
  total++;
  if (ok) console.log(`  ok    ${name}`);
  else {
    failures++;
    console.error(`  FAIL  ${name}${note ? ` — ${note}` : ""}`);
  }
};

for (const fx of fixtures) {
  const root = mkdtempSync(join(tmpdir(), "kb-gates-"));
  try {
    const dir = join(root, "openspec/changes", SLUG);
    mkdirSync(dir, { recursive: true });
    const put = (name: string, def: Gate | undefined, fallback: Gate) => {
      const g = def === undefined ? fallback : def;
      if (g) writeJson(join(dir, "gates", `${name}.json`), g);
    };
    put("spec-verify", fx.sv, sv());
    put("code-reviewer", fx.cr, cr());
    put("security-reviewer", fx.sec, sec());
    put("qa", fx.qa, qa());
    if (fx.tasks !== undefined) writeFileSync(join(dir, "tasks.md"), fx.tasks);
    for (const [rel, content] of Object.entries(fx.files ?? {})) {
      const abs = join(root, rel);
      mkdirSync(dirname(abs), { recursive: true });
      writeFileSync(abs, content);
    }

    const results = validateChangeGates(root, fx.slug ?? SLUG, undefined, { archive: fx.archive });
    let ok = results.every((r) => r.result.ok) === fx.expectOk;
    let note = "";
    if (ok && fx.fail) {
      const hit = results.find((r) => r.gate === fx.fail!.gate);
      if (!hit || hit.result.ok) {
        ok = false;
        note = `expected ${fx.fail.gate} to fail`;
      } else if (!hit.result.detail.includes(fx.fail.includes)) {
        ok = false;
        note = `expected "${fx.fail.includes}" in "${hit.result.detail}"`;
      }
    }
    if (ok && fx.warn) {
      if (!results.some((r) => r.result.ok && r.result.warning?.includes(fx.warn!))) {
        ok = false;
        note = `expected warning "${fx.warn}"`;
      }
    }
    report(fx.name, ok, note);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// --- распознавание команды archive хуком (строки собраны из частей: сам хук читает текст команд) ---
const ARCHIVE_CLI = ["openspec", "archive"].join(" ");
const ARCHIVE_DIR = ["openspec/changes", "archive"].join("/");
const hookCases: [string, string, string | null][] = [
  ["mv с абсолютными путями", `mv "/p/openspec/changes/demo-change" "/p/${ARCHIVE_DIR}/2026-10-24-demo-change"`, "demo-change"],
  ["git mv", `git mv openspec/changes/demo-change ${ARCHIVE_DIR}/x`, "demo-change"],
  ["CLI archive -y", `npx ${ARCHIVE_CLI} -y demo-change`, "demo-change"],
  ["обычная команда", "git status && ls openspec/changes", null],
  ["mkdir каталога archive", `mkdir -p ${ARCHIVE_DIR}`, null],
  ["mv без slug → блок", `git mv x ${ARCHIVE_DIR}/`, ""],
];
for (const [name, cmd, expect] of hookCases) {
  const got = archivedSlug(cmd);
  report(`хук archive: ${name}`, got === expect, `got ${JSON.stringify(got)}`);
}

// --- замок на деплой ---
{
  const mk = () => mkdtempSync(join(tmpdir(), "kb-deploy-"));
  const tsx = join(process.cwd(), "node_modules/.bin/tsx");
  const script = join(process.cwd(), "scripts/verify-deploy-gates.ts");
  const run = (root: string) => spawnSync(tsx, [script], { cwd: root, encoding: "utf8" });
  const empty = mk();
  const bare = mk();
  const green = mk();
  try {
    mkdirSync(join(empty, "openspec/changes/archive/2026-01-01-old"), { recursive: true });
    mkdirSync(join(bare, "openspec/changes", SLUG), { recursive: true });
    mkdirSync(join(green, "openspec/changes", SLUG), { recursive: true });
    for (const [name, gate] of [["spec-verify", sv()], ["code-reviewer", cr()], ["security-reviewer", sec()], ["qa", qa()]] as const) {
      writeJson(join(green, "openspec/changes", SLUG, "gates", `${name}.json`), gate);
    }
    report("деплой: archive не считается активным change", activeChanges(empty).length === 0);
    const r0 = run(empty);
    report("деплой: активных changes нет → exit 0", r0.status === 0, `${r0.status} ${r0.stderr}`);
    const r1 = run(bare);
    report("деплой: активный change без гейтов → exit 1", r1.status === 1 && r1.stderr.includes(SLUG), `${r1.status} ${r1.stderr}`);
    const r2 = run(green);
    report("деплой: активный change с четырьмя гейтами → exit 0", r2.status === 0, `${r2.status} ${r2.stderr}`);
  } finally {
    for (const d of [empty, bare, green]) rmSync(d, { recursive: true, force: true });
  }
}

if (failures > 0) {
  console.error(`verify:change-gates:selftest FAIL — ${failures} из ${total}`);
  process.exit(1);
}
console.log(`verify:change-gates:selftest OK — ${total} кейсов`);
