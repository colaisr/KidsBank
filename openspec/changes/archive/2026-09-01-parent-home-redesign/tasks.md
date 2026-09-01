## 1. Scroll shell

- [x] 1.1 Refactor `ParentShell.tsx`: add `kb-parent-shell` wrapper with `min-h-0 flex-1 flex-col` and inner `overflow-y-auto` scroll area (mirror `ChildShell` pattern); verify `/parent` scrolls to spending section when content overflows viewport

## 2. Unified layout & hero

- [x] 2.1 Merge greeting gradient block and balance summary into a single hero inside scroll area; move content sections to `bg-surface-muted` with consistent `space-y-6` rhythm
- [x] 2.2 Replace `.parent-quick-actions` / `.parent-action-card` CSS with Tailwind 2×2 grid on `ParentHomePage`; remove all `html[data-theme]` parent layout overrides from `index.css`; verify AMIO and Evoca show identical structure, different colors only

## 3. Component polish

- [x] 3.1 Tweak `ParentTaskRow` and `ParentGoalRow` spacing/token usage (buttons, cards) without changing actions or data; verify edit/cancel/confirm still work
- [x] 3.2 Ensure long hy strings in quick-action labels do not overflow grid cells (`min-w-0`, sensible font sizes)

## 4. PlanDocs

- [x] 4.1 Update `PlanDocs/01-surf-baseline.md` parent section: one layout for both banks, theme = color only; note scroll fix
- [x] 4.2 Add journal entry to `PlanDocs/19-work-plan.md`

## 5. Validation

- [x] 5.1 Run `npm run build` and confirm it passes
- [x] 5.2 Manual QA on mobile viewport: scroll works; quick actions (transfer, task, goal, limit) and all sections functional; switch AMIO ↔ Evoca — same layout, different palette; check ru/hy/en for clipping
