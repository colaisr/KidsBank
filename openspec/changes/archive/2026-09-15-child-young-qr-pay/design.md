## Decisions

- Phases: `scanning` (timer `YOUNG_QR_SCAN_MS` ≈ 5.5s) → `confirm` → `demoQrPay` via `sweetShop`.
- Fixed demo amount `350` AMD (`src/data/youngQrPay.ts`).
- Page-local dark theme (scanner chrome); orange viewfinder accents per mockup.
- Bottom camera control restarts scan from confirm or idle.
