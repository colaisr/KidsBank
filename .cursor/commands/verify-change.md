---
name: /verify-change
id: verify-change
category: Roles
description: Шаг verify между apply и archive — spec-verifier, code-reviewer, security-reviewer, qa в новых чатах
---

Шаг **verify** для OpenSpec change (slug в сообщении). Цепочка: `propose → apply → verify → Archive feedback loop → archive`, деплой preview по запросу (`docs/roles/openspec-gates.md`). Этот чат — оркестратор: проверки идут в **новых чатах**, здесь ничего не чинится. В Cursor субагентов нет, поэтому каждую стадию запускают отдельным чатом и передают **только slug** (ревьюерам ещё `scope_files`) без пересказа «что сделано».

1. **Спека.** Новый чат: `/spec-verifier <slug>`. Gate JSON → `openspec/changes/<slug>/gates/spec-verify.json`. Проверка: `npm run verify:change-gates -- --change <slug> --gate spec-verify`. Не 0 → стоп.
2. **Ревью.** `scope_files` — изменённые файлы change, кроме `openspec/changes/<slug>/**`, только файлы. Два новых чата: `/code-reviewer` и `/security-reviewer` с тем же `scope_files`. Gate JSON → `gates/code-reviewer.json`, `gates/security-reviewer.json`. Проверка `--gate code-reviewer` и `--gate security-reviewer`. Не 0 → стоп.
3. **qa.** Новый чат: `/qa` режим «стадия verify». Gate JSON → `gates/qa.json`. Проверка `--gate qa`. Не 0 → стоп.
4. **Финал.** `npm run verify:change-gates -- --change <slug>` → 0 = verify зелёный. `tasks.md` здесь не трогать.

**Итог:** таблица стадий. Fail «не доделано» — чинить в основном чате и снова verify; «расхождение со спекой» — вопрос владельцу (код или спека). Дальше Archive feedback loop и `/opsx-archive`.
