## 1. Preferences and onboarding

- [x] 1.1 Add `childExperience` to preferences (`kidsbank.childExperience`, default `teen`, `experienceFromAgeRange`)
- [x] 1.2 Onboarding age Continue persists experience and navigates to `/child`; pre-select age from stored experience

## 2. Shell and routing

- [x] 2.1 Hide `ChildTabBar` when `childExperience === 'young'`
- [x] 2.2 Split teen home to `TeenChildHomePage`; `ChildHomePage` switches on experience
- [x] 2.3 Route `/child/young/totem` placeholder

## 3. Young home UI

- [x] 3.1 Young home layout (header, card, quick tiles inert, accounts rows, tasks, lion dock)
- [x] 3.2 i18n `ui.childYoung.*` hy/ru/en

## 4. Verify

- [x] 4.1 `npm run build`
- [x] 4.2 Update `PlanDocs/01-surf-baseline.md` age paragraph
