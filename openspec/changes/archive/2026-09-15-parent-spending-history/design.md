## UI

- `ChildPageTitle` + scroll body как у `/parent/reports`.
- Summary card: label, `formatCurrency` total, `ParentSpendingMiniDonut` (month slices из `getSpendingReport('month')`, без центра).
- Groups: uppercase muted headers (`ui.piggy.dayToday` / `dayYesterday` / `dayEarlier`).
- Rows: reuse `TransactionRow` с `subtitleMode="time"`; только `typeId === 'spend'`, сортировка по `at` desc.

## Data

- `computeMonthSpendTotal(transactions)` — сумма `spend` в текущем календарном месяце.
- Seed: sweet shop 180 today 13:45; supermarket 260 yesterday 19:10; arcade 100 yesterday 17:32; прочие spend сдвинуты для месячной суммы ~1340 AMD.

## i18n

- `ui.parent.spendingHistoryScreen.monthSpentLabel`
- Remove placeholder key.
