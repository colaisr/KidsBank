## 1. OpenSpec & bridge foundation

- [x] 1.1 `clearDesignerHandoffStorage`, entry id tracker, `syncDesignerEntriesToKidsBank` in `kidsbankDemoBridge.ts`
- [x] 1.2 Wire `DemoState.update` to sync entries; hook `resetDemoState` + `languageChanged`

## 2. Demo parity

- [x] 2.1 Map designer entry kinds to `TransactionTypeId` (spend, cardToPiggy, piggyToCard, taskReward, mobileTopUp)
- [x] 2.2 Verify reset clears handoff and parent/child balances align
- [x] 2.3 QR pay 8–10: faux scanner (parity with young 6–8), 350 AMD `sweetShop`

## 3. i18n

- [x] 3.1 Add `ui.designerChild` to hy.json, ru.json, en.json (child-facing screens)
- [x] 3.2 `useDesignerChildT` helper; migrate App, FeatureScreen, PaymentFlow, PetScreen, TaskCard, HeroCarousel, CardDesignScreen
- [x] 3.3 Child name from `demo.david.name` in designer header

## 4. Validation

- [x] 4.1 `npm run build`
- [x] 4.2 Manual smoke: hy/en on 8–10 home; reset; one QR/spend in transactions

## Archive feedback loop

- [x] PlanDocs: `01`, `15`, `17`
- [x] `docs/roles/developer.md` — bridge/reset/QR notes
- [x] `openspec archive child-young-designer-i18n-demo-parity` + коммит
