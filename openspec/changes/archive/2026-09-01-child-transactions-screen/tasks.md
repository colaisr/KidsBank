## 1. Data model & actions

- [x] 1.1 Extend `DemoTransaction` with optional `currency`, `taskId`, `merchantKey`; add `taskReward` to `TransactionTypeId` — verify TypeScript compiles
- [x] 1.2 Extend `appendTransaction` meta; `confirmTask` appends `taskReward`; hub spend passes `merchantKey` — verify confirm task adds row in devtools `kidsbank.demo`
- [x] 1.3 Add `createTransactionsSeed()` (6 rows, today/yesterday) to `cloneDemoBaseline()` — verify reset shows mакет-like history

## 2. Formatting helpers

- [x] 2.1 Add credit/debit helpers for filter + week rollup (`isTransactionCredit`, `getWeekBounds`) — verify unit behavior via manual check in page
- [x] 2.2 Reuse or share subtitle formatter for transaction time labels — verify «Сегодня, 14:30» in ru locale

## 3. UI components

- [x] 3.1 `ChildTransactionsHeader`: gradient, star, title, ℹ️, settings, filter segment, week summary chip — verify matches home header tokens on AMIO/Evoca
- [x] 3.2 Upgrade `TransactionRow`: colored icons per type, AMD/★ amounts, task/merchant labels — verify each seed row icon/color
- [x] 3.3 Rebuild `ChildTransactionsPage`: grouping by day, filter state, empty states — verify three filters and day headers

## 4. i18n & presenter

- [x] 4.1 `ui.transactions.*`: filters, weekSummary, taskLabel, qrSpend, day headers (or reuse piggy keys) — verify hy/ru/en switch
- [x] 4.2 `demo.merchants.sweetShop` (+ peers if needed) — verify spend row label
- [x] 4.3 Update `presenterSheets.ts` + `presenter.{hy,ru,en}.json` for `child-transactions` — verify ℹ️ sheet shows new rows and demo steps

## 5. PlanDocs

- [x] 5.1 Update `PlanDocs/01-surf-baseline.md` (таб транзакций: фильтры, AMD+★, сводка) and `PlanDocs/19-work-plan.md` journal entry — verify docs match acceptance

## 6. Validation

- [x] 6.1 `npm run build` passes
- [x] 6.2 Manual: AMIO + Evoca, hy/ru/en, mobile viewport — filters, summary, presenter sheet, hub purchase adds row, parent confirm adds ★ row
