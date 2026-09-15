## Decisions

- Reuse `demoSpend` pattern via `demoPhoneTopUp(state, amount)` with `merchantKey: 'mobileTopUp'`.
- Presets in `src/data/youngPhoneTopup.ts` (`[500, 1000, 2000]`, default 1000).
- Phone display: `demo.child.david.phone` i18n (masked +374).
- `YoungQuickActions`: `topUpPhone` → `Link` to route.
