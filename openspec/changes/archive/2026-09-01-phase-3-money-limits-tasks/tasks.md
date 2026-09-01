## 1. Demo state v2 and actions

- [x] 1.1 Extend `demoBaseline.ts`: v2, `parentWallet`, `cardLimit`, `transactions`, `goal.amdValue`/`redeemed`
- [x] 1.2 Migration in `demoState.ts` for v1→v2
- [x] 1.3 `demoActions.ts`: task, goal, transfer, limit, spend helpers

## 2. i18n

- [x] 2.1 hy/ru/en: `ui.parent.*`, `ui.transfer.*`, `ui.limit.*`, `ui.transactions.*`, `demo.transactions.*`, task/goal action labels

## 3. Child interactions

- [x] 3.1 Interactive `TaskRow` (accept / complete)
- [x] 3.2 Interactive `GoalCard` (allocate stars, redeem)
- [x] 3.3 `ChildTransactionsPage` with `TransactionRow`

## 4. Parent home

- [x] 4.1 `ParentHomePage`: summary, quick actions, pending tasks, spending preview
- [x] 4.2 AMIO grid / Evoca feed via theme CSS (one component)
- [x] 4.3 `TransferModal`, `LimitModal`; confirm tasks from parent
- [x] 4.4 Replace `ParentShell` placeholder with parent home

## 5. PlanDocs alignment

- [x] 5.1 `01`: B1/B4 flows documented as live
- [x] 5.2 `15`: demo state v2 fields
- [x] 5.3 `17-theme-*`: parent home layout note
- [x] 5.4 `19`: phase 3 closed on archive

## 6. Presenter settings access

- [x] 6.1 `DemoSettingsPanel` shared; profile page = role + bank + lang + reset
- [x] 6.2 `DemoSettingsLink` (chat icon) on `ChildHomeHeader` and `ChildPageTitle`
- [x] 6.3 Router state `from` + back arrow on profile returns to previous child screen
- [x] 6.4 i18n `ui.app.settings`; hub and profile card pass `from` state

## 7. Validation

- [x] 7.1 Full task→stars→goal→AMD scenario clickable
- [x] 7.2 Transfer + limit + parent spending history
- [x] 7.3 AMIO + Evoca, hy/ru/en, reset restores v2 baseline
- [x] 7.4 Settings: chat from goals → change language → back to goals
- [x] 7.5 `npm run build` passes
