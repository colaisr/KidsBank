## Why

Young quick action «Оплатить по QR» was inert. Demo needs a believable QR pay flow: scan simulation, confirm, small AMD spend.

## What Changes

- Route `/child/young/qr-pay` (young only).
- Dark scanner UI per mockup; ~5.5s simulated scan, then confirmation sheet.
- Demo payment ~350 AMD at `sweetShop` (QR line in transactions).

### Non-goals

- Real QR decoding, payment gateway, teen variant.

### Acceptance

- Young home → QR → scan → confirm → balance/transaction updated; hy/ru/en; `npm run build`.

## Capabilities

- `child-young-qr-pay` (new)
