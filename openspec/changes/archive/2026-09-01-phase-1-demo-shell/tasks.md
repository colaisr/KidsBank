## 1. Project scaffold

- [x] 1.1 Initialize Vite + React + TypeScript in `src/` (`main.tsx`, `App.tsx`, `index.html`, `vite.config.ts`) and verify `npm run dev` serves the app
- [x] 1.2 Add Tailwind CSS 4, `postcss.config.js`, `src/index.css` with base resets, and verify utility classes render
- [x] 1.3 Add `package.json` scripts `dev`, `build`, `preview` and verify `npm run build` completes without errors
- [x] 1.4 Add `react-router-dom` dependency and wire `BrowserRouter` in `App.tsx` with placeholder routes

## 2. Theme system

- [x] 2.1 Define CSS custom properties for AMIO tokens in `src/themes/amio.css` per `PlanDocs/17-theme-bank-1.md` and verify `[data-theme="amio"]` applies cerulean primary
- [x] 2.2 Define CSS custom properties for Evoca tokens in `src/themes/evoca.css` per `PlanDocs/17-theme-bank-2.md` and verify violet `#6400DC` appears on primary elements
- [x] 2.3 Map Tailwind theme colors to CSS variables (`bg-primary`, `text-primary`, etc.) and verify one component class works in both themes
- [x] 2.4 Add inline boot script in `index.html` to set `data-theme` from localStorage/query before React mount and verify no white flash on reload

## 3. Internationalization

- [x] 3.1 Configure i18next + react-i18next in `src/i18n/index.ts` with `hy`, `ru`, `en` resources
- [x] 3.2 Create `src/locales/hy.json`, `ru.json`, `en.json` with `ui.*` keys for app, appearance, role, shell sections
- [x] 3.3 Add `demo.child.david.name` in all three locale files with distinct translations
- [x] 3.4 Create `src/data/children.ts` with `{ id: 'child.david' }` only (no hardcoded text) and verify child name resolves via `t('demo.child.david.name')`
- [x] 3.5 Add `src/lib/format.ts` with locale-aware `Intl` helpers (`hy-AM`, `ru-RU`, `en-US`) for future currency formatting

## 4. Preferences and persistence

- [x] 4.1 Implement `PreferencesContext` with `bank`, `locale`, `role` state and defaults (`amio`, `ru`, `child`)
- [x] 4.2 Implement init priority: URL query `?bank=&lang=` → localStorage → defaults; verify `?bank=evoca&lang=en` overrides stored values
- [x] 4.3 On preference change: update `data-theme`, `document.lang`, i18n language, localStorage, and `history.replaceState` for query params without reload
- [x] 4.4 Persist `role` separately in localStorage and verify role survives page refresh

## 5. Layout and shell components

- [x] 5.1 Build `PhoneFrame` component (max-width ~390px, centered on desktop, `100dvh`) and verify layout at 390px and 1280px viewports
- [x] 5.2 Build `AppHeader` with localized title, appearance navigation link, and child/parent role segmented control
- [x] 5.3 Build `ChildShell` page: gradient header, greeting with demo child name, empty-state placeholder — all strings from i18n
- [x] 5.4 Build `ParentShell` page: distinct localized title and empty-state, same layout structure as child (no markup fork per theme)
- [x] 5.5 Wire routes `/child`, `/parent`, `/appearance` with role switch navigating between shells without full reload

## 6. Appearance screen

- [x] 6.1 Build `AppearancePage` with bank section (AMIO / Evoca radio cards with color swatches) using `ui.appearance.*` keys
- [x] 6.2 Add language section (Հայերեն / Русский / English) and verify selecting each locale updates all visible `ui.*` and `demo.*` immediately
- [x] 6.3 Ensure appearance screen has no role toggle and verify role remains unchanged after bank/language switch
- [x] 6.4 Add back navigation to return to active role shell and verify one-tap access to appearance from both child and parent shells

## 7. Typography

- [x] 7.1 Load Noto Sans + Noto Sans Armenian (and Montserrat for Evoca headings if used) and verify Armenian, Cyrillic, and Latin render without tofu
- [x] 7.2 Set `dir="ltr"` on `<html>` for all locales and verify layout direction is left-to-right

## 8. PlanDocs alignment

- [x] 8.1 Update `PlanDocs/19-work-plan.md`: mark Phase 1 in progress/completed in journal with date and link to this change
- [x] 8.2 Update `PlanDocs/15-architecture.md` only if actual folder structure differs from documented layout (note deltas)

## 9. Validation

- [x] 9.1 Smoke AMIO theme: child shell + parent shell render with correct cerulean tokens at 390px viewport
- [x] 9.2 Smoke Evoca theme: child shell + parent shell render with violet primary at 390px viewport
- [x] 9.3 Smoke all three locales (`hy`, `ru`, `en`): switch on appearance screen without reload; verify child name and UI chrome change language together
- [x] 9.4 Smoke persistence: set Evoca + hy + parent, reload, verify all three preferences restore; test deep link `?bank=amio&lang=en` overrides storage
- [x] 9.5 Run `npm run build` and verify production build succeeds with no TypeScript errors
