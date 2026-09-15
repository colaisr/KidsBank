## Why

Young (6–10) cab uses the same `/child/card-design` entry from the product card but needs a simpler picker: **4 themes** (Океан, Космос, Лео, Джунгли) per mockup, without the teen six-skin grid and globe banner.

## What Changes

- Route `/child/card-design` branches on `childExperience`: teen unchanged; young → new screen.
- Skins `leo` and `jungle` added to `kidsbank.cardSkin` (young grid only; teen grid still six).
- Young UI: subtitle, 2×2 tiles, CTA «Готово»; i18n `ui.childYoung.cardDesign.*` hy/ru/en.
- CSS token overlays for `leo` / `jungle` on child shell.

### Non-goals

- Changing teen card-design layout or skin count.
- Parent cabinet styling.

### Acceptance

- Young: tap card on home → 4 themes → Готово → accents update, back to `/child`.
- Teen: still six skins + banner + «Применить дизайн».
- `npm run build`; PlanDocs `01` note.

## Capabilities

### New Capabilities

- `child-young-card-design`

### Modified Capabilities

- `child-card-design`: route branches by experience
- `preferences`: card skins `leo`, `jungle`
