## 1. Demo state and pet logic

- [x] 1.1 Add `PetState` (+ `taskBuff`) to `demoBaseline.ts`; baseline per design.md
- [x] 1.2 Bump `DEMO_STATE_VERSION` to 4; `normalizeDemoState` backfill `pet`
- [x] 1.3 Create `src/lib/pet.ts`: level, decay, hints (incl. navigation), `canAffordAction`, `applyPetAction` (cost stars, taskBuff)
- [x] 1.4 `demoActions.ts`: `feedPet`, `playWithPet`, `sleepPet`
- [x] 1.5 `confirmTask`: set `pet.taskBuff = true`

## 2. UI components

- [x] 2.1 `PetLevelBadge` + `PresenterInfoBadge` (muted ℹ️, 20px)
- [x] 2.2 `PetPresenterSheet` — child value / bank value / 90s script tables
- [x] 2.3 `PetSpeechBubble` — hints, red dot, tappable navigation to tasks/goals
- [x] 2.4 `PetCharacter` — SVG/CSS, theme-aware
- [x] 2.5 `PetNeedBars` — three progress bars
- [x] 2.6 `PetActionButtons` — **cost** labels (5/8/3 ★), disabled when insufficient stars

## 3. Child pet page

- [x] 3.1 Rebuild `ChildPetPage`: tick on mount (visitCount++, revisit decay), layout per mockup
- [x] 3.2 Wire actions, level-up toast, presenter sheet
- [x] 3.3 Remove placeholder (`ui.placeholder.pet`)

## 4. i18n

- [x] 4.1 `ui.pet.*`: level, needs, actions, levelUp, insufficientStars
- [x] 4.2 `demo.pet.hints.*`: feedMe, sleepy, playWithMe, happy, earnStars, thanksForTask, checkGoals
- [x] 4.3 `ui.pet.presenter.*`: open, child/bank/demo section titles and table rows (hy/ru/en)

## 5. PlanDocs alignment

- [x] 5.1 `01`: секция «Питомец» — продуктовая ценность, финансовый loop, taskBuff, presenter badge
- [x] 5.2 `01`: обновить «Экономика звёзд» — питомец тратит ★
- [x] 5.3 `references/README.md`: `R-amio-junior-pet`
- [x] 5.4 `19`: journal entry `child-pet-page`

## 6. Validation

- [x] 6.1 Feed costs 5 ★; insufficient stars → disabled + earnStars hint
- [x] 6.2 Parent confirm task → free care once
- [x] 6.3 Happy pet → checkGoals navigates to goals
- [x] 6.4 ℹ️ badge → presenter sheet with value tables
- [x] 6.5 Full 90s script incl. role switch; revisit decay; AMIO + Evoca; hy/ru/en; reset; `npm run build`
