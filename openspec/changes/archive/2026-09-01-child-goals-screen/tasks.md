## 1. Data & catalog

- [x] 1.1 Add `goalCatalog.ts` with 6 entries (tones, targets per mock) and extend `goalTemplates` / `demo.goals` locales for `sneakers`, `skateboard`, `book` — verify catalog ids resolve in i18n
- [x] 1.2 Update `DEMO_BASELINE` goals seed (ps5 + sneakers in progress); `activateCatalogGoal` in `demoActions.ts` — verify select adds goal and hides catalog card

## 2. Header & page shell

- [x] 2.1 `ChildGoalsHeader`: gradient, star left, title, `HeaderPresenterActions`, stars banner — verify matches transactions header pattern
- [x] 2.2 Rebuild `ChildGoalsPage`: 2-col grid, merge active + catalog lists — verify six cards on reset before any select

## 3. Cards & actions

- [x] 3.1 `GoalCatalogCard` with tone header, progress vs «Выбрать» — verify active vs catalog visual states
- [x] 3.2 `GoalActionSheet`: allocate + redeem (reuse `STAR_ALLOCATE_STEP`) — verify +★ and redeem update balances

## 4. i18n & presenter

- [x] 4.1 `ui.goals.*` banner, inProgress, select — hy/ru/en
- [x] 4.2 Update `presenterSheets.ts` + `presenter.{hy,ru,en}.json` for `child-goals` — verify ℹ️ sheet

## 5. PlanDocs

- [x] 5.1 Update `PlanDocs/01-surf-baseline.md` (таб целей) and `PlanDocs/19-work-plan.md` — verify docs match acceptance

## 6. Validation

- [x] 6.1 `npm run build` passes
- [x] 6.2 Manual: AMIO/Evoca, hy/ru/en, select catalog goal, allocate, redeem, home preview still works
