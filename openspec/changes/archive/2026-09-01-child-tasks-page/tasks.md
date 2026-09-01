## 1. Demo state and data

- [x] 1.1 Extend `DemoTaskState`: `templateId`, `dueTime`; add `taskStats` to demo state type
- [x] 1.2 Create `src/data/taskTemplates.ts` with template catalog
- [x] 1.3 Update `demoBaseline.ts`: 5 tasks per mockup, `taskStats` { 860, 31 }
- [x] 1.4 `normalizeDemoState`: backfill `templateId`, `dueTime`, `taskStats` for old localStorage
- [x] 1.5 `demoActions.ts`: `addTask`, update `confirmTask` to increment `taskStats`

## 2. UI components

- [x] 2.1 `TaskStatsCards` — earned stars + completed count cards
- [x] 2.2 `TaskCard` — reward badge, title, deadline/done label, checkbox; `compact` prop for home
- [x] 2.3 `sortTasksForDisplay` helper

## 3. Child tasks page

- [x] 3.1 Rebuild `ChildTasksPage`: stats cards + sorted `TaskCard` list
- [x] 3.2 Wire checkbox to `acceptTask` / `completeTask`

## 4. Child home preview

- [x] 4.1 Replace `TaskRow` with compact `TaskCard` on `ChildHomePage` (first 2 active tasks)

## 5. Parent add task

- [x] 5.1 `AddTaskModal`: template select, reward chips, time input, duplicate guard
- [x] 5.2 `ParentHomePage`: «Задание» quick action opens modal

## 6. i18n

- [x] 6.1 hy/ru/en: `ui.tasks.statsEarned`, `statsCompleted`, `deadline`, `pageTitle`; `demo.tasks.hangLaundry`, `addGoal`, `dishes`
- [x] 6.2 Update `tidyRoom` title to match mock («Убраться в комнате» / en / hy)

## 7. PlanDocs alignment

- [x] 7.1 `01`: B4 screen + parent creates tasks
- [x] 7.2 `19`: journal entry for `child-tasks-page`

## 8. Validation

- [x] 8.1 `/child/tasks`: stats 860/31, 5 cards, checkbox flow, done styling
- [x] 8.2 Parent: add task → visible for child; confirm → stats increment
- [x] 8.3 AMIO + Evoca, hy/ru/en, reset restores baseline
- [x] 8.4 `npm run build` passes
