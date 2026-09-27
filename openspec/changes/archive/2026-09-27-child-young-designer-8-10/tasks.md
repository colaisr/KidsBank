## 1. Experience model (6–8 / 8–10 / 10–12+)

- [x] 1.1 Extend `ChildExperience` to `young` | `youngDesigner` | `teen` and map onboarding ages (`6-8` → young, `8-10` → youngDesigner, `10-12+` → teen) in `src/context/childExperience.ts`; verify `persistChildAgeSelection` writes correct keys
- [x] 1.2 Migrate stored `young` + `childAgeRange=8-10` to effective `youngDesigner` on read; verify reload keeps designer UI

## 2. Vendor handoff integration

- [x] 2.1 Copy designer `app/src` → `src/designer-child/` and `app/public` → `public/` from handoff `evoca-kids-app-2026-09-24`; verify assets load at `/assets/*`
- [x] 2.2 Add handoff npm dependencies and Vite/tsconfig `@` alias; verify `npm run build` succeeds
- [x] 2.3 Export `HomeApp` from `designer-child/App.tsx` and mount via `src/pages/DesignerChildExperience.tsx`; verify `/child` at age 8–10 matches handoff home (carousel, Leo, bottom nav)

## 3. KidsBank shell wiring

- [x] 3.1 Route `ChildHomePage` to `DesignerChildExperience` when `youngDesigner`; keep `YoungChildHomePage` for `young` and teen unchanged
- [x] 3.2 Update `ChildShell`: hide tab bar for `youngDesigner`, viewport lock on `/child`, redirect stray `/child/*` to `/child` (except profile + onboarding); verify `/child/profile` and onboarding still work
- [x] 3.3 Keep young-only routes (`/child/young/*`) gated on `childExperience === 'young'` only; verify 8–10 does not open KidsBank young sub-routes

## 4. Demo state bridge (parent cabinet)

- [x] 4.1 Implement `kidsbankDemoBridge.ts` and patch `designer-child/DemoState.tsx` to sync core fields with `kidsbank.demo`; dispatch `kidsbank-demo-updated` from `writeDemoState`
- [x] 4.2 Verify parent task confirm updates child designer task list/stars in same browser session

## 5. Validation

- [x] 5.1 `npm run build` passes
- [x] 5.2 Manual: AMIO + Evoca × ages 6–8, 8–10, 10–12 — tab bar, home variant, parent confirm task (designer RU copy documented)

## 6. Documentation (pre-archive)

- [x] 6.1 Update `PlanDocs/01-surf-baseline.md` — three child UI tiers and 8–10 designer handoff
- [x] 6.2 Update `PlanDocs/15-architecture.md` — `youngDesigner`, `src/designer-child/`, storage keys, bridge
- [x] 6.3 Update `PlanDocs/17-design-guidelines.md` (or theme doc) — note Evoca-handoff visual for 8–10 until AMIO pass
- [x] 6.4 Update `docs/roles/developer.md` — designer-child module and bridge (if needed)

## 7. Unified demo settings

- [x] 7.1 `/child/profile` — role toggle in header; bank/lang/reset via `DemoSettingsPanel`; David → onboarding
- [x] 7.2 `/appearance` redirect; all David entry points → profile

## Archive feedback loop

- [x] PlanDocs: `01`, `15`, `17` (and roles per §6)
- [x] `docs/roles/`: developer — if §6.4 done
- [x] `openspec archive child-young-designer-8-10` + коммит архива, specs и docs
