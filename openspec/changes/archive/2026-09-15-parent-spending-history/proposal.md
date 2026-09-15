## Why

Родителю нужна **полная история трат** ребёнка — следующий пункт сервисов после отчётов (макет roadmap). Сводка за месяц + лента покупок по дням.

## What Changes

- **`/parent/spending-history`:** карточка «Потрачено в этом месяце» с суммой AMD и мини-donut; список AMD-покупок (`spend`), сгруппированный по **сегодня / вчера / ранее**; время в строке; иконки по типу/мерчанту.
- **`/parent`:** строка «История трат» в сервисах (после отчётов).
- Демо-транзакции подогнаны под макет (Sweet Shop, продуктовый, игровой автомат).
- Утилиты `parentSpendingHistory` (месячная сумма из demo `spend`).

### Non-goals

- Фильтры как у ребёнка, экспорт, live ledger.
- Удаление превью трат с главной родителя (остаётся).

### Acceptance

- hy / ru / en; AMIO / Evoca одна вёрстка.
- `npm run build`; PlanDocs `01` при archive.

## Capabilities

### New

- `parent-spending-history`

### Modified

- `parent-home`: строка истории трат.
- `app-shell`: маршрут `/parent/spending-history`.
