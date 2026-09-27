## Why

Слой **8–10** (`youngDesigner`) визуально зашит в Evoca handoff (`--brand` фиолет, `leoConfig` пишет в `:root`). Переключатель **AMIO** в `/child/profile` меняет `data-theme` для teen/young, но не для designer child. Для показа обоим банкам нужен AMIO-проход без форка вёрстки.

## What Changes

- `html[data-theme='amio'] .kb-designer-child` — палитра Cerulean / Atoll / Casablanca (как `src/themes/amio.css`).
- Убрать глобальную подмену `--brand*` на `documentElement` из `leoConfig.ts`; JS-палитра (ambient, confetti) от `kidsbank.bank`.
- Синхронизация дизайна карты: `kidsbank.cardSkin` ↔ `evoca-card-design` для id `ocean|space|leo|jungle`.
- AMIO-варианты градиентов карт в `accounts.css` (согласовано с `youngCardThemes` / AMIO card-skins).

### Non-goals

- AMIO для handoff parent UI; Leo configurator; teen/young регрессии; новые скины beyond 4 young themes.

### Acceptance

- Возраст 8–10, **AMIO**: нет фиолетовых primary; фон/кнопки/звёзды — teal + orange accents.
- **Evoca** 8–10 без регрессии.
- Смена `cardSkin` на 6–8 отражается на карте 8–10 после перезахода/обновления handoff.
- `npm run build` OK.

## Capabilities

### New Capabilities

- `child-young-designer-amio-theme`: AMIO/Evoca theming для integrated designer child shell и карт.

## Impact

- `src/designer-child/` (CSS, `leoConfig`, `CardVisual`, `App`, `AmbientBackground`, `designerBrand`, `designerCardSkin`)
- `DesignerChildExperience.tsx`
- PlanDocs `17`, `17-theme-bank-1`, `15` (archive loop)
