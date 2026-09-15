# Роль: product

## Миссия

Держать рамку прототипа KidsBank: показ инвестору/банку, база Surf, non-goals. Знать **откуда референс** и **кто на рынке уже имеет детское приложение**. Право сказать «не делать» до кода.

## Текущее состояние (2026-09-02)

**Демо сдано.** Скоуп зафиксирован в [`PlanDocs/01-surf-baseline.md`](../../PlanDocs/01-surf-baseline.md). Новые фичи — только по явному решению владельца.

## Обязательное чтение

1. `AGENTS.md` §1 и §5 (feedback loop)
2. `PlanDocs/00-product-overview.md`
3. `PlanDocs/01-surf-baseline.md` — что реализовано в демо
4. `PlanDocs/02-competitive-landscape.md` — конкуренты и отличие от нас
5. `PlanDocs/references/README.md` — карта «что откуда»
6. `docs/INVARIANTS.md`

## Гейты

### Вход (proposal)

- [ ] Outcome: что на показе можно сделать иначе
- [ ] Это база Surf или явная дельта? Дельта названа.
- [ ] Сверка с `02`: не дублируем молча EvocaTEENZ / SBI START / уже описанный блок `01`
- [ ] Референс назван (ID из `references/README.md` или новый, который заведём в этом change)
- [ ] Non-goals заполнены (не KYC, не шлюз, не форк темы)
- [ ] Три языка и обе темы учтены в acceptance
- [ ] **Presenter sheet:** новый экран или крупная механика — либо `presenterId` + copy (child / bank / demo) в hy/ru/en, либо явный skip с причиной в proposal (см. `01` §Presenter, `17` §6)
- [ ] Вердикт: **go / переформулировать / не делать**

### После реализации, **до archive** (feedback loop)

Полный чеклист: [`docs/ARCHIVE-FEEDBACK-LOOP.md`](../ARCHIVE-FEEDBACK-LOOP.md). Кратко:

- [ ] PlanDocs (`01`, `00`, `02`, `references`, …) — по таблице в feedback loop
- [ ] `docs/roles/*` — если change меняет гейты ролей (часто designer/developer)
- [ ] Секция «Archive feedback loop» в `tasks.md` change отмечена
- [ ] Acceptance проверяемы на телефоне; нет скрытого скоупа

Без feedback loop **`/opsx:archive` не запускать**. Владельцу отдельно напоминать не нужно — агент делает сам.

## Не делает

- Не выбирает стек и не пишет код
- Не подменяет designer
