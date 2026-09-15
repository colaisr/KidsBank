## Context

Stakeholder mock: teal/orange palette aligned with AMIO tokens; donut 810 AMD week total matching category breakdown.

## Decisions

1. **Data:** `getSpendingReport(period)` returns static demo slices; month uses scaled totals.
2. **Chart:** SVG stroke donut (`ParentSpendingDonut`), no chart library.
3. **PDF:** Outlined button; tap shows localized demo message (no file).
4. **Period UI:** Same pill segment pattern as transfer/limits screens.
