## 1. Preferences and theme tokens

- [x] 1.1 Extend `preferences.ts`: `CardSkin` type, `STORAGE_KEYS.cardSkin`, `DEFAULT_CARD_SKIN`, read/write helpers
- [x] 1.2 `PreferencesContext`: `cardSkin`, `setCardSkin`; `applyDocumentPreferences` sets `data-card-skin`
- [x] 1.3 `src/themes/card-skins.css`: token overrides per `data-theme` × `data-card-skin` (6 skins × 2 banks); import in `index.css`
- [x] 1.4 Optional `.kb-pay-card` ornament classes per skin for home card face

## 2. Card design screen

- [x] 2.1 `CardSkinTile`: preview gradient, motif, label, selected checkmark, a11y `radiogroup`
- [x] 2.2 `ChildCardDesignPage`: info banner, 2×3 grid, local selection state, apply → persist + navigate home
- [x] 2.3 Route `/child/card-design` in `App.tsx`; `ChildPageTitle` back to `/child`

## 3. Child home entry

- [x] 3.1 `AccountsSection`: product card links to `/child/card-design` with tap affordance

## 4. i18n

- [x] 4.1 hy/ru/en: `ui.cardDesign.title`, `banner`, `apply`, `skins.ocean|space|dinosaurs|unicorns|robots|racing`

## 5. Parent scope guard

- [x] 5.1 Ensure card-skin CSS selectors do not alter parent shell accents (scope or neutral parent tokens)

## 6. PlanDocs alignment

- [x] 6.1 `01`: card design screen and B6 personalization note
- [x] 6.2 `19`: journal entry for this change

## 7. Validation

- [x] 7.1 Home → card design → select skin → apply → home reflects skin; refresh persists
- [x] 7.2 All 6 skins visually distinct; default `ocean` matches pre-change baseline
- [x] 7.3 AMIO + Evoca, hy/ru/en; demo reset restores default skin
- [x] 7.4 `npm run build` passes
