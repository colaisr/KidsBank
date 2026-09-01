## 1. Demo actions

- [x] 1.1 `updateTask(state, taskId, { rewardStars, dueTime })` with `notEditable` guard for `done`
- [x] 1.2 `cancelTask(state, taskId)` removes non-`done` tasks without star payout

## 2. Parent UI

- [x] 2.1 `ParentTaskRow` — title, reward, deadline, status, action buttons
- [x] 2.2 `EditTaskModal` — reward chips + time input, read-only template title
- [x] 2.3 `ParentHomePage`: секция «Задания ребёнка» (объединить с confirm для `waitingParent`)

## 3. i18n

- [x] 3.1 hy/ru/en: `ui.parent.childTasks`, `ui.editTask.*`, `ui.parent.editTask`, `ui.parent.cancelTask`

## 4. PlanDocs alignment

- [x] 4.1 `01`: родитель редактирует и отменяет активные задания
- [x] 4.2 `19`: journal entry for `parent-update-tasks`

## 5. Validation

- [x] 5.1 Edit reward/deadline → child sees update; cancel removes task; cancel waitingParent no ★
- [x] 5.2 AMIO + Evoca, hy/ru/en, reset baseline
- [x] 5.3 `npm run build` passes
