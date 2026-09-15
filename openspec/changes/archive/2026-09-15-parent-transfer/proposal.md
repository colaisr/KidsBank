## Why

Перевод родителю ребёнку — ключевой сценарий family banking. После геолокации stakeholder-макет задаёт **отдельный полноэкранный перевод** (сегмент карта/копилка, пресеты суммы, регулярность для демо), а не модалку из быстрых действий. Нужно выровнять IA кабинета родителя и дать убедительный сценарий на preview.

## What Changes

- **`/parent`:** быстрые действия **без перевода** (задание, цель, лимит); секция **«Сервисы»** с геолокацией и **«Перевод»** (подзаголовок «На карту или в копилку») → `/parent/transfer`.
- **`/parent/transfer`:** заголовок «Перевод {{name}}»; сегмент **На карту / В копилку**; сумма с пресетами **200 / 500 / 1000** и **«Своя»**; блок **регулярного перевода** (toggle + периодичность в sheet, демо без бэкенда); CTA **Перевести {amount}** → `transferParentToChild`, успех и возврат на `/parent`; подсказка кошелька родителя.
- **Shell:** на `/parent/transfer` скрыты `AppHeader` и `ParentChildHeader` (как на геолокации); scroll в outlet.
- **Presenter:** `parent-transfer`; шаг `parent-home` обновлён под сервисы.
- **PlanDocs:** `01`, `02`, `references/README` (roadmap).

### Non-goals

- Реальное расписание автопереводов, push, SEPA/карточный шлюз.
- Второй ребёнок в сиде; перевод между детьми.
- Удаление `TransferModal` из репозитория (может остаться неиспользуемым).

### Acceptance

- hy / ru / en; AMIO и Evoca — одна вёрстка, токены темы.
- Перевод обновляет demo balances и появляется в истории/копилке по существующей логике `money-flow`.
- `npm run build`; инварианты репозитория.

## Capabilities

### New Capabilities

- `parent-transfer`: экран `/parent/transfer`, UI перевода, демо recurring UI.

### Modified Capabilities

- `parent-home`: IA быстрых действий и секция сервисов.
- `app-shell`: маршрут и shell chrome для transfer.
- `presenter-value-sheets`: `parent-transfer`, шаги `parent-home`.

## Impact

- **Код:** `ParentTransferPage`, `ParentHomePage`, `ParentServiceRow`, `ParentShell`, `App.tsx`, `presenterSheets`, локали `ui.*` / `presenter.*`.
- **Спеки:** перечисленные capabilities.
