## 1. Demo state and data

- [x] 1.1 Extend `DemoGoalState`: `templateId`, optional `customTitle`
- [x] 1.2 Create `src/data/goalTemplates.ts` with catalog, presets, icon defaults
- [x] 1.3 Update baseline goals with `templateId`; `normalizeDemoState` backfill
- [x] 1.4 `demoActions.ts`: `addGoal` with duplicate/emptyTitle guards
- [x] 1.5 `lib/goals.ts`: `getGoalTitle`, `getActiveGoals`, `isActiveGoalTemplate`

## 2. Parent UI

- [x] 2.1 `AddGoalModal` — template, other+custom title, icon, target ★, AMD chips
- [x] 2.2 `ParentGoalRow` — title, progress, target, AMD (read-only)
- [x] 2.3 `ParentHomePage`: quick action «Цель» + секция «Цели ребёнка»

## 3. Child display

- [x] 3.1 `GoalCard` + home preview: `getGoalTitle` instead of hardcoded id key

## 4. i18n

- [x] 4.1 hy/ru/en: `ui.addGoal.*`, `ui.parent.addGoal`, `ui.parent.childGoals`; `demo.goals.headphones`

## 5. PlanDocs alignment

- [x] 5.1 `01`: родитель создаёт цели; обновить таблицу «задания vs цели»
- [x] 5.2 `19`: journal entry for `parent-add-goal`

## 6. Validation

- [x] 6.1 Parent add goal → visible on `/child/goals`; allocate/redeem works
- [x] 6.2 «Другое» + custom text; duplicate template blocked
- [x] 6.3 AMIO + Evoca, hy/ru/en, reset baseline
- [x] 6.4 `npm run build` passes
