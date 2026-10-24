# OpenSpec и гейты ролей

> **Статус:** живой рецепт (2026-10-24). Как change в `openspec/` стыкуется с ролями `docs/roles/`. Перенесено из AgentPoint и адаптировано под KidsBank: нет CI и lint, деплой ручной, продукт расходный.

## Цепочка

```text
product + designer        → вход на proposal (гейт product, UI-контракт)
/opsx:propose             → proposal, design, tasks; владелец утверждает спеку
/opsx:apply               → developer, основной чат (там вся история решений)
/verify-change <slug>     → шаг verify, каждая стадия отдельным субагентом со свежим контекстом,
                            вход только slug (ревьюерам ещё scope_files):
                            1. spec-verifier       → gates/spec-verify.json    (код против спеки)
                            2. code-reviewer ∥ security-reviewer
                                                   → gates/code-reviewer.json, gates/security-reviewer.json
                            3. qa                  → gates/qa.json             (сборка и сценарии)
                            любой fail → стоп; чиним в основном чате → снова /verify-change
Archive feedback loop     → PlanDocs и роли по docs/ARCHIVE-FEEDBACK-LOOP.md
/opsx:archive             → замок --archive; затем перенос в archive, коммит
npm run deploy:preview    → по запросу владельца; замок verify:deploy-gates
```

**Verify только находит и сообщает.** Находку «не доделано» чинит основной чат. Находку «расхождение со спекой» решает владелец: правится код или спека.

**Правило свежести.** После любой правки кода заново проходят стадия, на которой нашли проблему, и все после неё. Скрипт это проверяет: гейт ниже по цепочке не может быть старше гейта выше (`reviewed_at`).

## Что делает каждый гейт

| Гейт | Файл | Принимается, если |
| --- | --- | --- |
| spec-verify | `gates/spec-verify.json` | `pass` без критических находок (`findings.critical = 0`), либо valid skip |
| code-reviewer | `gates/code-reviewer.json` | `pass` без Important, `round ≤ 2`, либо valid skip |
| security-reviewer | `gates/security-reviewer.json` | `pass` с `depth` не ниже требуемой скриптом, `scope_files` покрывают код, либо valid skip |
| qa | `gates/qa.json` | `pass` и в `checks` есть `npm run build`, либо valid skip |

Valid skip: `docs-only` (все файлы из allowlist), `meloch` (1–2 файла, не для security и qa), `owner-waiver` с `waiver_note` ≥ 10 символов от владельца.

## Замки (механика, а не просьба к агенту)

- **Скрипт гейтов:** `npm run verify:change-gates -- --change <slug>` проверяет четыре гейта, порядок свежести и формат; с `--archive` ещё и отсутствие незакрытых задач в `tasks.md`.
- **Замок на archive.** Хук `scripts/hooks/guard-archive.mjs` подключён в `.claude/settings.json` (PreToolUse, Bash) и `.cursor/hooks.json` (beforeShellExecution). Перед переносом change в `openspec/changes/archive/` (`mv`, `git mv`) или `openspec archive <slug>` он запускает `verify:change-gates --archive` и блокирует команду при fail. Хук реагирует и на текст команды (например, внутри `echo`); правки файлов со строками про archive делай через Edit/Write.
- **Замок на деплой.** В KidsBank push в `main` ничего не выкатывает, деплой ручной, поэтому замок стоит там, где выкатывается: `scripts/verify-deploy-gates.ts` вызывается в начале `scripts/remote-deploy.sh` и `scripts/deploy-preview.sh`. Пока есть активный change (папка в `openspec/changes/`, кроме `archive/`), деплой идёт только при четырёх зелёных гейтах. Активных changes нет: деплой разрешён. Замка на push нет сознательно: пуш незаконченной работы в `main` здесь норма и ничего не ломает.

## Границы (честно)

- Файлы-гейты пишет оркестратор по отчётам субагентов. Замки защищают от ошибки и забывчивости агента, а не от умысла; хуки обходятся (другая оболочка, `cd` + `mv`).
- Гейт не привязан к содержимому кода: правка после зелёного verify не ловится, скрипт видит только порядок времени гейтов.
- Замок деплоя смотрит рабочую копию. VPS делает `git pull` по `main`, поэтому проверка на другой ветке или с незапушенными коммитами приблизительна. Запускай деплой с актуальной `main`.
- Cursor: субагентов нет. `/verify-change` там означает «каждая стадия в новом чате, только slug», остальное то же. Хук Cursor проверен по формату входа и выхода, вживую не гонялся.

## После `openspec init` / `openspec update`

Генератор перезаписывает сгенерированные файлы, стирает наши вставки и удаляет проектные команды, которых нет в профиле. Сразу после него восстанови всё одной командой и просмотри `git diff`:

```bash
npm run openspec:restore
```

Скрипт `scripts/openspec-restore.mjs` идемпотентен: повторный запуск ничего не меняет. Эталоны лежат в `scripts/openspec-inserts/` (вставки `*.md` и копии кастомных файлов в `files/`) — правки вставок делай там, потом запускай restore. Если OpenSpec сдвинул разметку и якорь не найден, скрипт падает с exit 1 и называет файл: поправь якорь в скрипте, смысл вставки не меняй. `npm run openspec:restore -- --check` ничего не пишет и падает, если чего-то нет; он же входит в `npm run verify:change-gates:selftest`.

Справка — что восстанавливает скрипт:

1. строку «KidsBank — гейты и Archive feedback loop» сразу после вводной строки и шаг **4b «KidsBank checkpoint»** перед «5. Perform the archive» в `.cursor/commands/opsx-archive.md`, `.cursor/skills/openspec-archive-change/SKILL.md`, `.claude/commands/opsx/archive.md`, `.claude/skills/openspec-archive-change/SKILL.md` (в скиллах строка идёт в тело, не во frontmatter `description`: там она ломает YAML);
2. блок «tasks.md must end with» перед **Guardrails** в `.cursor/skills/openspec-propose/SKILL.md` и `.claude/skills/openspec-propose/SKILL.md`;
3. кастомные файлы `.cursor/commands/opsx-update.md` и `.cursor/skills/openspec-update-change/SKILL.md`.

Замок archive от этого не зависит: его держит хук. Профиль OpenSpec глобальный (`~/.config/openspec/config.json`): в нём должен быть workflow `verify`.

## Шаблон блока в `tasks.md`

```markdown
## Гейты и Archive feedback loop

- [ ] verify: `/verify-change <slug>`, `npm run verify:change-gates -- --change <slug>` exit 0
- [ ] PlanDocs (см. docs/ARCHIVE-FEEDBACK-LOOP.md)
- [ ] docs/roles/ — designer / developer / product / ревьюеры при необходимости
```

Пункта «archive» в `tasks.md` нет: сам archive — это шаг `/opsx:archive`, а замок `--archive` требует, чтобы к этому моменту все задачи были закрыты. Все остальные пункты (включая feedback loop) закрываются **до** archive.
