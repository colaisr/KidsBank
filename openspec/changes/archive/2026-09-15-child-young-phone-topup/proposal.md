## Why

Young home quick action «Пополнить телефон» was visual-only. Demo needs a dedicated screen per mockup (masked number, amount presets, CTA).

## What Changes

- Route `/child/young/phone-topup` (young `childExperience` only; others redirect `/child`).
- Navigation from young quick-action tile.
- UI: header, «Мой номер» card, amount presets 500/1000/2000 AMD, «Пополнить».
- Demo: successful top-up debits card, adds `spend` transaction with `merchantKey` `mobileTopUp`.

### Non-goals

- QR / transfer quick actions (separate changes).
- Real payments, operator APIs.

### Acceptance

- Young → tap phone tile → screen matches layout; hy/ru/en; `npm run build`.

## Capabilities

- `child-young-phone-topup` (new)
