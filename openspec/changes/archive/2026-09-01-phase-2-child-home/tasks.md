## 1. Demo data and i18n

- [x] 1.1 `demoBaseline.ts` + типы: card, piggy, starsBalance, tasks (rewardStars, statusId), goals (currentStars, targetStars)
- [x] 1.2 i18n hy/ru/en: `ui.nav.*`, `ui.home.*`, `ui.appearance.demoSection|resetDemo|resetHint`, `ui.tasks.rewardStars`, `ui.goals.targetStars`
- [x] 1.3 `demo.goals.ps5`, `demo.tasks.*` на трёх языках

## 2. Junior home and navigation

- [x] 2.1 `ChildHomePage`: header «Главный», profile card, AccountsSection, tasks, goals (Junior order)
- [x] 2.2 `ChildTabBar`: Главная / Цели / FAB hub / Транзакции / Питомец
- [x] 2.3 Routes: `/child`, `/child/goals`, `/child/hub`, `/child/transactions`, `/child/pet`, `/child/tasks`, `/child/profile`
- [x] 2.4 Placeholder pages: transactions, pet, hub

## 3. Demo state and reset

- [x] 3.1 `DemoStateContext` + `kidsbank.demo` persistence
- [x] 3.2 Components read from `useDemoState()` (accounts, tasks, goals)
- [x] 3.3 «Сбросить сценарий» on AppearancePage; does not reset bank/lang/role

## 4. PlanDocs alignment

- [x] 4.1 `01`: Junior home + экономика звёзд (display ф.2, механика ф.3)
- [x] 4.2 `15`: demo state, `kidsbank.demo`, reset
- [x] 4.3 `17-theme-*`: Junior nav IA
- [x] 4.4 `19`: фаза 2 закрыта при archive
- [x] 4.5 `INVARIANTS`, `OPEN-QUESTIONS` Q5

## 5. Validation

- [x] 5.1 AMIO + Evoca smoke on `/child`
- [x] 5.2 hy/ru/en + reset restores baseline
- [x] 5.3 `npm run build` passes
