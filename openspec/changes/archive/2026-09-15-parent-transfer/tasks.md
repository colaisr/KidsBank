## 1. Routing & shell

- [x] 1.1 Add `/parent/transfer` route in `App.tsx` under `ParentShell`
- [x] 1.2 Extend `isParentSubScreen` to hide `AppHeader` / `ParentChildHeader` on transfer

## 2. Parent home IA

- [x] 2.1 Remove transfer from quick-actions grid (task, goal, limit only)
- [x] 2.2 Add «Сервисы» section with geolocation + transfer rows (`ParentServiceRow`)

## 3. Transfer page

- [x] 3.1 Implement `ParentTransferPage`: segment card/piggy, amount, presets, custom amount
- [x] 3.2 Recurring toggle + periodicity sheet (demo state only)
- [x] 3.3 Submit → `transferParentToChild`, success feedback, navigate back
- [x] 3.4 Design polish: shadows, segment track, sticky CTA, wallet pill

## 4. i18n & presenter

- [x] 4.1 `ui.parent.transferScreen.*`, `services`, `transferSubtitle` (hy/ru/en)
- [x] 4.2 Register `parent-transfer` in `presenterSheets.ts` + presenter locales
- [x] 4.3 Update `parent-home` presenter demo step (services → transfer)

## 5. PlanDocs (feedback loop)

- [x] 5.1 Update `PlanDocs/01` parent section (services, transfer screen, presenter table)
- [x] 5.2 Note in `PlanDocs/02` and `references/README` (`R-parent-roadmap`)

## 6. Verification

- [x] 6.1 Manual: `/parent` → transfer → AMIO/Evoca; hy/ru/en
- [x] 6.2 `npm run build`
