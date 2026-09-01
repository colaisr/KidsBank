## 1. i18n

- [x] 1.1 Add `ui.onboarding.role.*` and `ui.onboarding.age.*` keys to `hy.json`, `ru.json`, `en.json` (headings, card titles/descriptions, age labels, continue, footer tagline) and verify all three locales render without missing keys

## 2. Routing and shell

- [x] 2.1 Register routes `/child/onboarding/role` and `/child/onboarding/age` under child shell in `App.tsx` and verify both URLs load without 404
- [x] 2.2 Hide `ChildTabBar` on `/child/onboarding/*` paths and verify tab bar is absent on onboarding screens but present on `/child`

## 3. Onboarding role screen

- [x] 3.1 Implement `OnboardingRolePage` per mockup (logo area, rocket illustration, two role cards, footer) using theme tokens and verify layout on AMIO and Evoca themes
- [x] 3.2 Wire parent card to `setRole('parent')` + navigate to `/parent` and verify parent dashboard opens
- [x] 3.3 Wire child card to navigate to `/child/onboarding/age` and verify age screen opens
- [x] 3.4 Add back control to return to `/child/profile` and verify navigation

## 4. Presenter sheet (age screen)

- [x] 4.1 Add `onboarding-age` to `presenterSheets.ts` and `ui.presenter.sheets.onboarding-age` copy in `presenter.hy.json`, `presenter.ru.json`, `presenter.en.json` (child / bank / demo steps) and verify sheet opens with all three locales

## 5. Onboarding age screen

- [x] 5.1 Implement `OnboardingAgePage` with `ChildPageTitle` + `presenterId="onboarding-age"` per mockup (progress step 2, five age-range cards with emoji + radio, subtitle) and verify ℹ️ opens presenter sheet
- [x] 5.2 Wire Continue to navigate to `/child` without writing to `kidsbank.demo` or localStorage and verify demo balances/tasks unchanged after flow
- [x] 5.3 Add back control to `/child/onboarding/role` and verify navigation

## 6. Profile entry point

- [x] 6.1 Make David child card on `ChildProfilePage` tappable → `/child/onboarding/role` and verify `RoleToggle` below still works independently

## 7. Validation and docs

- [x] 7.1 Run `npm run build` and manually smoke: profile → David → role → age → ℹ️ sheet → continue → home; profile → David → parent; hy/ru/en; AMIO + Evoca on narrow viewport
- [x] 7.2 Update `PlanDocs/01-surf-baseline.md` (onboarding demo scenario from profile) and `PlanDocs/19-work-plan.md` journal entry for this change
