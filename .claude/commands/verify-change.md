---
description: Шаг verify KidsBank между apply и archive — spec-verifier → code-reviewer ∥ security-reviewer → qa, каждый субагентом; гейты в gates/*.json; fail останавливает
argument-hint: <change-slug>
---

Шаг **verify** для OpenSpec change `$ARGUMENTS`. Цепочка: `propose → apply → verify → Archive feedback loop → archive`, деплой preview по запросу (`docs/roles/openspec-gates.md`). Ты — **оркестратор**: стадии запускаешь субагентами, сам код не проверяешь и **ничего не чинишь** в этом шаге.

**Вход.** Slug из аргумента. Если его нет — `npx openspec list --json` и спроси владельца, не угадывай.

**Независимость.** Каждой стадии передавай **только** slug (ревьюерам ещё `scope_files`). Не пересказывай, что сделано в apply, и не подсказывай, где искать.

## Стадия 1 — спека

1. Субагент `spec-verifier`, промпт: `Change: <slug>. Раунд: <N>.` (N = прошлый `round` из `gates/spec-verify.json` + 1, иначе 1).
2. Запиши его Gate JSON в `openspec/changes/<slug>/gates/spec-verify.json` (`reviewed_at` — текущее время ISO).
3. `npm run verify:change-gates -- --change <slug> --gate spec-verify`. Не 0 → **стоп**, переходи к «Итог».

## Стадия 2 — ревью (параллельно)

1. `scope_files` — все файлы, изменённые в change, кроме `openspec/changes/<slug>/**` (по `git status`, `git diff --name-only` и tasks.md). Только файлы, не каталоги.
2. В одном сообщении два субагента: `code-reviewer` и `security-reviewer`, промпт обоим: `Change: <slug>. scope_files: [...]. Раунд: <N>.`
3. Запиши `gates/code-reviewer.json` и `gates/security-reviewer.json` по их ответам.
4. `npm run verify:change-gates -- --change <slug> --gate code-reviewer` и `--gate security-reviewer`. Любой не 0 → **стоп**.

## Стадия 3 — qa

1. Субагент `qa`, промпт: `Change: <slug>. Режим: стадия verify. Верни Gate JSON для gates/qa.json.`
2. Запиши `gates/qa.json`; в `checks` — только команды и сценарии, которые qa реально прогнал.
3. Не 0 по `--gate qa` → **стоп**.

## Финал

`npm run verify:change-gates -- --change <slug>` (все четыре гейта и порядок). 0 → «verify зелёный». `tasks.md` в этом шаге не трогай: галочки ставит основной чат.

## Итог (всегда)

Короткая таблица стадий: pass / fail / не запускалась. Для fail — находки как есть:

- **не доделано** → «чинить в основном чате, затем снова `/verify-change <slug>`»;
- **расхождение со спекой** → вопрос владельцу: менять код или спеку; ничего не менять без ответа;
- **ревью fail на раунде 2** → эскалация владельцу (скрипт так и скажет).

Дальше: Archive feedback loop (`docs/ARCHIVE-FEEDBACK-LOOP.md`), затем `/opsx:archive`. Деплой preview только по запросу владельца.
