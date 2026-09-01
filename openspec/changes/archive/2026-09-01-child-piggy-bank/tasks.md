## 1. Demo state and helpers

- [x] 1.1 Extend `demoBaseline.ts`: `piggy.shareSlug`, piggy deposit `typeId`s, `isPiggyDeposit`, seed txs in `cloneDemoBaseline`
- [x] 1.2 `normalizeDemoState` in `demoState.ts` for missing `shareSlug`
- [x] 1.3 `getPiggyShareUrl` in `lib/piggy.ts`; `formatPiggyDepositDate` in `format.ts`

## 2. Piggy bank screen

- [x] 2.1 `ChildPiggyBankPage`: balance hero, share card (copy/share), deposits grouped by day
- [x] 2.2 `PiggyDepositRow` with icons per deposit type
- [x] 2.3 Route `/child/piggy` in `App.tsx`

## 3. Child home entry

- [x] 3.1 `AccountsSection`: piggy tile links to `/child/piggy`

## 4. i18n

- [x] 4.1 hy/ru/en: `ui.piggy.*`, `demo.transactions.piggy*`, `demo.piggy.gift*.initial`

## 5. Integration with parent transfer

- [x] 5.1 Verify `parentToPiggy` transfers appear in piggy deposits list (no modal changes needed)

## 6. PlanDocs alignment

- [x] 6.1 `01`: piggy screen and B1 flow documented
- [x] 6.2 `19`: journal entry for this change

## 7. Validation

- [x] 7.1 Home → piggy → back; copy link; deposits today/yesterday
- [x] 7.2 Parent transfer to piggy visible on piggy screen
- [x] 7.3 AMIO + Evoca, hy/ru/en, reset restores piggy seed
- [x] 7.4 `npm run build` passes
