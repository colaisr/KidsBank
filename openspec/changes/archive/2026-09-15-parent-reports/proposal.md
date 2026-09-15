## Why

Родителю нужен **обзор трат ребёнка** по категориям — следующий пункт меню roadmap после заданий. Макет: период неделя/месяц, donut, список категорий, демо-скачивание PDF.

## What Changes

- **`/parent/reports`:** сегмент Неделя/Месяц, диапазон дат (демо-copy), donut с суммой, строки категорий (еда, транспорт, копилка, другое), CTA PDF (демо-toast).
- **`/parent`:** строка «Отчёты» в сервисах (уже добавлена).
- Демо-агрегация в `parentSpendingReport` (фиксированные срезы, не боевой BI).

### Non-goals

- Реальный PDF, экспорт, привязка к live ledger банка.
- Динамический расчёт из всех transactions (можно позже).

### Acceptance

- hy / ru / en; AMIO / Evoca одна вёрстка.
- `npm run build`; PlanDocs `01` при archive.

## Capabilities

### New

- `parent-reports`

### Modified

- `parent-home`: строка отчётов.
- `app-shell`: маршрут `/parent/reports`.
