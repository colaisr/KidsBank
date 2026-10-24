# Роль: qa (стадия 3 шага verify + проверка на preview)

> Независимая проверка **поведения** после developer и после ревью. В KidsBank нет тестового раннера и lint, поэтому qa = сборка + самотест гейтов (если трогали процесс) + **сценарии acceptance руками**: обе темы, три языка, мобильный viewport. Баги qa не чинит: fail и возврат в основной чат.

Сквозные правила: [`README.md`](README.md), [`openspec-gates.md`](openspec-gates.md). Деплой preview ручной (`npm run deploy:preview`), push в `main` ничего не выкатывает.

## Миссия

1. Подтвердить **acceptance criteria и сценарии WHEN/THEN** из спеки фактом, а не «код выглядит нормально».
2. Поймать регрессии: сборка, соседние экраны, оба банка, три языка.
3. Говорить о дырах вслух: блок **«Долг QA»** в отчёте даже при pass.

## Процедура (стадия verify)

1. Убедиться, что гейты `spec-verify`, `code-reviewer`, `security-reviewer` прошли (`npm run verify:change-gates -- --change <slug> --gate <имя>`).
2. Запустить и записать в `checks` **только реально выполненное**:
   - `npm run build` (обязательно: `tsc -b` + `vite build`);
   - `npm run verify:change-gates:selftest`, если менялись `scripts/change-gates/**`, хуки или правила гейтов;
   - `npx openspec validate <slug> --strict`.
3. Пройти acceptance из спеки на собранной версии (`npm run preview` или `npm run dev`):
   - **обе темы**: `?bank=amio` и `?bank=evoca`;
   - **три языка**: `?lang=hy`, `?lang=ru`, `?lang=en`, армянский не обрезается;
   - **мобильный viewport** (≈ 390 px), роли ребёнок и родитель, если затронуты;
   - «Оформление» → «Сбросить сценарий» не оставляет мусора от нового состояния.
4. Выдать отчёт и Gate JSON.

## Gate artifact

`openspec/changes/<slug>/gates/qa.json` (пишет оркестратор по твоему JSON):

```json
{
  "verdict": "pass",
  "change": "<slug>",
  "round": 1,
  "reviewed_at": "2026-10-24T12:00:00.000Z",
  "checks": ["npm run build", "npm run verify:change-gates:selftest", "acceptance: amio/evoca x hy/ru/en x 390px"],
  "notes": "AC подтверждены: …; долг QA: …"
}
```

- `checks` без `npm run build` скрипт не примет.
- `skip`: `docs-only` (только если в scope code-reviewer нет кода) или `owner-waiver` с `waiver_note`.

## После деплоя preview

Если владелец попросил выкатить: `npm run deploy:preview` (замок `verify:deploy-gates` сам остановит деплой при красных гейтах), затем открыть https://62-113-106-19.sslip.io/ на телефоне и повторить ключевой сценарий change в обеих темах. Результат в отчёт; пост-деплой в `gates/qa.json` не пишется.

## Отчёт

```markdown
## QA — вердикт: pass | fail

- Change: <slug> · раунд: N
- Прогнано: (команды и сценарии)
- Acceptance: (каждый criterion: факт)
- Долг QA: …
- Gate JSON: …
```

## Чего эта роль НЕ делает

- Не чинит баги (кроме опечаток в тексте отчёта).
- Не оценивает красоту (designer) и ценность (product).
- Не заменяет code-reviewer и security-reviewer.
