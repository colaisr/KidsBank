# Archive feedback loop (обязательно)

Каждый `/opsx:archive` **заканчивается** выровненной документацией. Синк `openspec/specs/` **не заменяет** PlanDocs и роли агентов.

**Порядок:** реализация → этот чеклист → `openspec archive` → коммит (доки + архив + specs) → push по запросу владельца.

Агент **не спрашивает** владельца «обновить ли документацию» — делает по чеклисту сам, если change затрагивает соответствующий слой.

---

## 1. PlanDocs (продукт и архитектура)

| Что изменилось в change | Куда дописать |
|-------------------------|---------------|
| Новый / изменённый демо-сценарий, экран, онбординг | [`PlanDocs/01-surf-baseline.md`](../PlanDocs/01-surf-baseline.md) |
| Конституция, аудитория, non-goals | [`PlanDocs/00-product-overview.md`](../PlanDocs/00-product-overview.md) |
| Конкурент, «у кого как в рынке» | [`PlanDocs/02-competitive-landscape.md`](../PlanDocs/02-competitive-landscape.md) |
| Новый скрин / PDF / макет | [`PlanDocs/references/README.md`](../PlanDocs/references/README.md) (+ файл в `references/`) |
| Стек, `localStorage`, структура `src/`, маршруты | [`PlanDocs/15-architecture.md`](../PlanDocs/15-architecture.md) |
| CI / preview (редко) | [`PlanDocs/16-ops-deploy.md`](../PlanDocs/16-ops-deploy.md) |
| UI-принципы, presenter, общие паттерны | [`PlanDocs/17-design-guidelines.md`](../PlanDocs/17-design-guidelines.md) |
| Палитра / токены AMIO | [`PlanDocs/17-theme-bank-1.md`](../PlanDocs/17-theme-bank-1.md) |
| Палитра / токены Evoca | [`PlanDocs/17-theme-bank-2.md`](../PlanDocs/17-theme-bank-2.md) |

Если пункт не применим — в summary archive явно: «PlanDocs: N/A для этого change».

---

## 2. Роли агентов (`docs/roles/`)

Обновлять **только если** change меняет то, как роль должна работать дальше (новый гейт, новый экран, новый токен, новый процесс).

| Роль | Файл | Примеры, когда править |
|------|------|-------------------------|
| **product** | [`product.md`](roles/product.md) | новый сценарий в baseline, гейты proposal/archive |
| **designer** | [`designer.md`](roles/designer.md) | новый layout (young/teen), токены, IA, запреты цветов |
| **developer** | [`developer.md`](roles/developer.md) | новые модули, маршруты, ключи storage, DoD |
| **devops** | [`devops.md`](roles/devops.md) | CI, деплой, env |

Также при необходимости:

- [`AGENTS.md`](../AGENTS.md) §5 — если меняется общий процесс.
- [`.cursor/commands/designer.md`](../.cursor/commands/designer.md) / `developer.md` / `product.md` — одна строка «см. ARCHIVE-FEEDBACK-LOOP», если в команде нет отсылки.

---

## 3. OpenSpec change `tasks.md`

В каждом change в конце tasks **должна** быть секция (копировать в propose):

```markdown
## Archive feedback loop

- [ ] PlanDocs: перечислить затронутые файлы из docs/ARCHIVE-FEEDBACK-LOOP.md
- [ ] docs/roles/: designer / developer / product / devops — только если нужно
- [ ] `openspec archive <change>` + коммит архива и specs
```

Отмечать `[x]` в том же PR/сессии, что и archive.

---

## 4. Чеклист агента перед `openspec archive`

1. Прочитать `proposal.md` + diff реализации: какие строки таблиц §1–§2 применимы.
2. Внести правки в PlanDocs и roles; `npm run build` если трогали только docs — не обязательно, если трогали код — обязательно.
3. Убедиться, что секция **Archive feedback loop** в `tasks.md` отмечена.
4. Выполнить `openspec archive <name> -y` (или sync + archive по skill).
5. **Один коммит** (или два: код уже в main, второй — archive + docs): сообщение упоминает change и «archive / feedback loop».

---

## 5. После archive (summary владельцу)

Кратко перечислить:

- какие PlanDocs обновлены;
- какие `docs/roles/*` обновлены или «без изменений»;
- путь архива `openspec/changes/archive/YYYY-MM-DD-<name>/`.
