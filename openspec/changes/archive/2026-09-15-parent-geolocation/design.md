## Context

See `proposal.md`. Parent cabinet today is a single route with hero, 2×2 actions, and inline lists. No map libraries in the repo. Preview is HTTPS-capable for `navigator.geolocation`.

## Goals / Non-Goals

**Goals:**

- Leaflet map with light raster tiles (no API keys in repo).
- Presenter GPS as child position; spend/saved places as offsets from session anchor or absolute fallback coords in Yerevan.
- Reusable parent UI: profile bar, service row, map page, bottom sheets.
- i18n + presenter for `parent-geolocation` and updated `parent-home` steps.

**Non-Goals:**

- Reverse geocoding, routing, geofencing, child-device tracking.
- Google/Mapbox SDKs; committing tile API secrets.

## Decisions

### 1. Leaflet + react-leaflet

**Choice:** `leaflet`, `react-leaflet`, import `leaflet/dist/leaflet.css` in the geolocation page or entry.

**Alternatives:** SVG schematic (rejected per product — real streets); Google Maps (billing + keys).

**Tiles:** Use a stable free light style (e.g. CARTO Positron or OpenFreeMap) via HTTPS URL template. Show OSM/CARTO attribution control per license.

### 2. Coordinate model

**Live mode (after first successful `getCurrentPosition`):**

- Store session anchor `{ lat, lng }` in React context or module state for the geolocation page visit (not necessarily persisted).
- Child marker: `watchPosition` or periodic `getCurrentPosition` while screen mounted.
- Saved places + spend pins in live mode: baseline **meter offsets** from anchor (defined in `demoBaseline` as `offsetMeters: { east, north }`) converted to lat/lng via simple flat-earth approximation (adequate for demo radius &lt; 2 km).

**Fallback mode:**

- Fixed `fallbackChildLatLng` and absolute lat/lng on places and spend rows in baseline (Yerevan area).
- Copy uses school-style `labelKey` on tag and status.

**Parent home status:** Derive from same helper `getParentLocationSummary(demo, liveSnapshot)` so row matches map mode.

### 3. Spend ↔ transactions

- Extend spend transactions in seed with `mapLat`/`mapLng` in fallback mode.
- In live mode, compute positions from offsets keyed by `transactionId` or `merchantKey` mapping table in baseline.
- If seed has only one spend with coords, add one more spend in baseline for second pin (per product).

### 4. Parent shell routing

- Refactor `ParentShell`: fixed top area with `ParentChildHeader` + optional `AppHeader` only on index, or unified header pattern.
- **Geolocation page:** `ChildPageTitle`-style bar with `backTo="/parent"`, title `ui.parent.geolocation.title` with `name` param, `HeaderPresenterActions` with `parent-geolocation`.
- **Home:** Keep `AppHeader` with `parent-home`; add `ParentChildHeader` below it (or replace hero greeting block gradually — design: profile row between AppHeader and hero).

Layout proposal:

```
AppHeader (parent title, ℹ️, role, appearance)
ParentChildHeader (avatar, name, age, chevron)
[Outlet: home | geolocation]
```

On geolocation route, swap AppHeader for back title row (like child subpages).

### 5. Sheets

Reuse existing modal/sheet patterns (e.g. transfer modal styling): `ParentBottomSheet` for child picker, saved places, payment places, spend detail.

### 6. Demo state version

Bump `kidsbank.demo` version (6): migrate v5 → v6 adding `children`, `activeChildId`, `locationUpdatedAt`, `locationMode` default `fallback`, saved places array, transaction map fields. On read, missing fields backfill from baseline.

### 7. Dependencies

Add to `package.json`: `leaflet`, `react-leaflet`, `@types/leaflet` (dev). Vite may need `optimizeDeps.include: ['leaflet']` if default markers break — use custom `DivIcon` markers (no default PNG paths).

### 8. Custom markers

Orange teardrop / child initial and blue spend icons per mock — CSS + div icons, theme `primary` / accent orange token for spend cluster.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Tile CDN blocked or slow on bank Wi‑Fi | Light tile URL; document fallback; optional static message if tiles fail |
| Geolocation prompt fails in iframe | Document presenter flow; fallback seed always works |
| Leaflet default icon 404 in Vite | Custom markers only |
| `watchPosition` battery | Clear watch on unmount; single page scope |
| Armenian longer strings in sheets | `line-clamp` + padding per `17` |

## Migration Plan

- Ship with static build; no server changes.
- Rollback: revert change; old localStorage v6 migrates down by reset scenario.

## Open Questions

- Exact tile URL after manual check on preview VPS (pick one provider in implementation).
