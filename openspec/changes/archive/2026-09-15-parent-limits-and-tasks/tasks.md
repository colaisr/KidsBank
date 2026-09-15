## 1. Parent home IA

- [x] 1.1 Remove limit and add-task from quick actions; keep add goal
- [x] 1.2 Add service rows: limits, tasks with badge (`waitingParent` count)
- [x] 1.3 Remove child tasks section from `/parent`

## 2. Limits screen

- [x] 2.1 Demo state v7: `transferRecipients`, `cashWithdrawal`, migration
- [x] 2.2 `ParentLimitsPage`: recipients, toggles, add sheet, cash stepper
- [x] 2.3 Route `/parent/limits`, shell sub-screen chrome
- [x] 2.4 i18n `ui.parent.limitsScreen.*`, `demo.limits.recipient.*`

## 3. Tasks screen

- [x] 3.1 `ParentTasksPage`: sections Pending / Completed today, new task CTA
- [x] 3.2 `ParentTaskListRow`; confirm sheet for `waitingParent`
- [x] 3.3 `completedAt` on confirm; seed completed-today demo
- [x] 3.4 Route `/parent/tasks`, i18n `ui.parent.tasksScreen.*`

## 4. PlanDocs (before archive)

- [x] 4.1 Update `PlanDocs/01` parent section (services menu, limits, tasks)
- [x] 4.2 Note in `PlanDocs/references/README` / `02` if needed

## 5. Verification

- [x] 5.1 Manual: services → limits / tasks; badge updates on confirm
- [x] 5.2 `npm run build`
