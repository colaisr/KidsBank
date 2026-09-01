## Context

Фазы 1–3 и копилка закрыты. Карта на главной — статичный `article.kb-pay-card` без перехода. Банковская тема — `data-theme` + CSS-токены в `src/themes/{amio,evoca}.css`. Evoca brand doc (`17-theme-bank-2`) упоминает выбор дизайна карты как фичу TEENZ. Макет: 6 скинов, инфо-плашка, apply-кнопка.

## Goals / Non-Goals

**Goals:**

- `/child/card-design` по макету: info banner, grid 2×3, selection + apply.
- `data-card-skin` оверлей токенов для детского кабинета поверх `data-theme`.
- Entry: tap card on home → design screen; back → home.
- Persist `kidsbank.cardSkin`; default `ocean`.

**Non-goals:**

- Parent shell skinning, physical card order, per-bank different skin sets, URL param for skin.

## Decisions

### 1. Route and entry

`App.tsx`: `<Route path="card-design" element={<ChildCardDesignPage />} />` inside `ChildShell`.

`AccountsSection`: wrap product card in `<Link to="/child/card-design">` (or `button` + navigate) with hover/focus affordance; piggy/stars tiles unchanged.

`ChildPageTitle` with `backTo="/child"`.

### 2. Skin ids and storage

```ts
type CardSkin = 'ocean' | 'space' | 'dinosaurs' | 'unicorns' | 'robots' | 'racing';
const STORAGE_KEY = 'kidsbank.cardSkin';
const DEFAULT_CARD_SKIN: CardSkin = 'ocean';
```

Stored in `preferences.ts` / `PreferencesContext` — **not** in `kidsbank.demo`. Reset scenario restores `ocean` via `DemoSettingsPanel`.

`applyDocumentPreferences(bank, locale, cardSkin)` sets `data-card-skin` on `<html>` alongside `data-theme`.

### 3. Token overlay model

New file `src/themes/card-skins.css` imported from `index.css`.

Pattern: `html[data-theme='amio'][data-card-skin='space'] { --kb-primary: ...; --kb-header-gradient: ...; }`

Each skin defines overrides for:
- `--kb-header-gradient` (card face)
- `--kb-primary`, `--kb-primary-dark`
- `--kb-fab`, `--kb-fab-glow`
- `--kb-accent-kids` (stars, rewards)

**Bank identity preserved:** AMIO skins stay in cyan/teal/warm family; Evoca skins anchor on violet (`#6400DC` or tints) per `17-theme-bank-2`. `ocean` = no effective change from current bank defaults.

Card decorations (waves, stars, dino silhouette, etc.) — CSS `::before`/`::after` or inline SVG in `CardSkinTile` preview + optional `data-card-skin` class on `.kb-pay-card` for home card ornament.

### 4. Screen UX

- Local `selectedSkin` state initialized from context; grid tap updates selection (checkmark on tile).
- «Применить дизайн» → `setCardSkin(selectedSkin)` → `navigate('/child')`.
- Info banner: globe icon + `ui.cardDesign.banner` (как на макете).
- `CardSkinTile`: mini card preview (gradient + motif), label below, `aria-pressed` / `role="radio"` in `radiogroup`.

### 5. Scope of “whole app adapts”

Skin tokens apply globally via CSS variables — child screens (home, goals, tasks, piggy, hub, transactions) pick up new accents automatically. Parent shell and `/appearance` ignore `data-card-skin` overrides (parent tokens use bank base only, or parent-specific rules without skin selectors).

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Evoca violet diluted by playful skins | Each Evoca skin keeps `--kb-primary` in violet family; only accents shift |
| 6×2 bank combos hard to polish | `ocean` = passthrough; other skins use restrained palette per mockup |
| Old localStorage without key | Default `ocean` on read |
| Card link vs future card actions | Only navigation to design; no balance actions on card tap |

## Migration Plan

Frontend only. No demo-state version bump. After archive: delta specs → main, journal in `PlanDocs/19`, note in `01` B6 row.
