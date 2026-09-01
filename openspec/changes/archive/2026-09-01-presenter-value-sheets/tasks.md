## 1. Shared components

- [x] 1.1 `src/data/presenterSheets.ts` — registry `presenterId` → row keys + demo step count
- [x] 1.2 `PresenterInfoBadge` → `src/components/PresenterInfoBadge.tsx`
- [x] 1.3 `PresenterValueSheet` — generic sheet from `presenterId`
- [x] 1.4 `ui.presenter.close` shared; migrate `child-pet` keys to `ui.presenter.sheets.child-pet.*`

## 2. ChildPageTitle + ChildHomeHeader

- [x] 2.1 `ChildPageTitle`: optional `presenterId` prop → badge + sheet
- [x] 2.2 `ChildHomeHeader`: `presenterId="child-home"`
- [x] 2.3 `SectionHeading` on home: optional `presenterId` per section

## 3. P0 pages — wire presenterId

- [x] 3.1 `/child/tasks`, `/child/goals`, `/child/piggy`, `/child/card-design`, `/child/transactions`, `/child/hub`
- [x] 3.2 `/parent` — badge on balance card
- [x] 3.3 `/appearance` — badge in header area
- [x] 3.4 `/child/pet` — refactor to shared component

## 4. P1 section sheets (child home)

- [x] 4.1 `child-accounts` on AccountsSection heading
- [x] 4.2 Reuse `child-tasks` / `child-goals` on section headings (short copy variant or same sheet)

## 5. i18n hy/ru/en

- [x] 5.1 All `ui.presenter.<id>.*` for P0 ids + `child-accounts`
- [x] 5.2 Remove obsolete `ui.pet.presenter.*` after migration

## 6. PlanDocs

- [x] 6.1 `01`: секция «Presenter value sheets» + таблица экранов
- [x] 6.2 `17`: guideline — muted ℹ️, не CTA
- [x] 6.3 `19`: journal entry

## 7. Validation

- [x] 7.1 Every P0 screen opens sheet with 3 blocks in hy/ru/en
- [x] 7.2 Pet regression; home section badges; build passes

## 8. Copy refresh (двухуровневая модель)

- [x] 8.1 `child-home` → North Star: глобальная ценность приложения (hy/ru/en)
- [x] 8.2 Остальные sheet'ы → «рычаг: …» без дублирования манифеста
- [x] 8.3 PlanDocs `01`, `17`, `19`; spec + archived `design.md` §7
