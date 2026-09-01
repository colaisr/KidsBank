## Why

На экране питомца (`child-pet-page`) presenter-бейдж ℹ️ с bottom sheet (ценность для ребёнка / банка / сценарий 90 с) хорошо работает на показе инвестору и банку. Остальные экраны прототипа — «красивые слайды» без явной продуктовой рамки для ведущего демо.

Нужно **системно** разнести ту же модель по ключевым экранам и механикам: каждый живой сценарий Surf/B1–B7 несёт ответ на «зачем ребёнку» и «зачем банку», плюс короткий скрипт показа.

**Не ломать:** инварианты, i18n hy/ru/en, одна вёрстка AMIO/Evoca. Бейдж — для презентера, не часть «клиентского» нарратива (muted, как у питомца).

## What Changes

- Общий компонент **`PresenterValueSheet`** + **`PresenterInfoBadge`** (вынести из `components/pet/`).
- Конфиг листов по `presenterId` — i18n `ui.presenter.<id>.*` (child/bank/demo таблицы + шаги).
- Подключить бейдж на **каждый приоритетный экран** (см. карту в `design.md`).
- **Рефактор** `/child/pet`: `PetPresenterSheet` → общий компонент.
- **Главная ребёнка:** page-level ℹ️ + опционально **секционные** ℹ️ у «Счета», «Задания», «Цели» (узкий фокус).
- PlanDocs `01`: секция «Presenter value sheets» — индекс экранов.

### Non-goals

- Бейджи на пустых/служебных экранах без продуктовой механики (`ChildShell`, роуты-обёртки).
- Отдельный «режим презентера» в URL — бейджи всегда доступны, но незаметны.
- Дублировать длинные тексты в PlanDocs — источник правды i18n + краткий индекс в `01`.
- Локализация вне hy/ru/en.

### Acceptance

- На каждом экране из таблицы P0 в `design.md` — muted ℹ️, тап → sheet с тремя блоками (ребёнок / банк / демо).
- `/child/pet` работает через общий компонент (поведение не регрессирует).
- `/child` — page sheet + 3 section sheets (счета, задания, цели).
- hy/ru/en; AMIO + Evoca; `npm run build` проходит.

## Capabilities

### New Capabilities

- `presenter-value-sheets`: общий UI и i18n-контракт product-value sheets на экранах демо.

### Modified Capabilities

- `child-home`: presenter badges (page + sections).
- `child-pet-page`: refactor на общий sheet.
- (per-screen deltas в tasks — без отдельных spec-файлов на каждый экран, один capability)

## Impact

- **Код:** `PresenterValueSheet`, `PresenterInfoBadge`, `presenterSheets.ts` (ids), правки `ChildPageTitle` / headers, все P0 pages, locales.
- **PlanDocs:** `01` (индекс presenter sheets), `17` (placement guideline), `19` (журнал).
