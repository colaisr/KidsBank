## 1. Data & demo state

- [x] 1.1 Bump demo schema v6: `children`, `activeChildId`, `locationUpdatedAt`, saved places, spend map coords/offsets; migration from v5
- [x] 1.2 Add baseline seed (fallback Yerevan, school/home/saved places, 2+ spend markers linked to transaction ids)
- [x] 1.3 Implement `resolveMapPositions(demo, liveAnchor)` for live vs fallback modes

## 2. Routing & shell

- [x] 2.1 Refactor `ParentShell` with `<Outlet />`; routes `/parent` index + `/parent/geolocation`
- [x] 2.2 Update `App.tsx` nested parent routes; unknown `/parent/*` → `/parent`
- [x] 2.3 Add `ParentChildHeader` + child picker sheet (single-child selected state)

## 3. Parent home

- [x] 3.1 Add `ParentServiceRow` geolocation entry after quick actions with synced status
- [x] 3.2 Optional compact spacing on 2×2 grid (tokens only, same four actions)

## 4. Geolocation page

- [x] 4.1 Add dependencies: leaflet, react-leaflet, types; Vite-friendly marker setup
- [x] 4.2 `ParentGeolocationPage`: map, geolocation hook (grant/deny/fallback), attribution
- [x] 4.3 Child marker, place markers, spend markers; pan to saved place on list tap
- [x] 4.4 Bottom status sheet (avatar, status, relative time, online dot)
- [x] 4.5 Buttons: saved places sheet, payment places sheet; spend marker tap → detail sheet

## 5. i18n & presenter

- [x] 5.1 `ui.parent.*` keys for geolocation, status (neutral + fallback), sheets, child profile (hy/ru/en)
- [x] 5.2 Register `parent-geolocation` in `presenterSheets.ts` + `presenter.{hy,ru,en}.json`
- [x] 5.3 Extend `parent-home` presenter demo steps (three locales)

## 6. PlanDocs (feedback loop before archive)

- [x] 6.1 Update `PlanDocs/01` parent section (geolocation entry + screen)
- [x] 6.2 Add `R-parent-roadmap` to `PlanDocs/references/README.md`; light note in `PlanDocs/02`
- [x] 6.3 Journal entry in `PlanDocs/19` when implementing

## 7. Verification

- [x] 7.1 Manual: `/parent` → geolocation → sheets → back; AMIO/Evoca; hy/ru/en
- [x] 7.2 Manual: GPS allow (neutral copy) vs deny (school fallback) on HTTPS preview
- [x] 7.3 `npm run build`
