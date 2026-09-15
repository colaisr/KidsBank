## Why

Young quick action «Перевести деньги» had no screen. Transfers must reflect the parent-configured allow list on limits.

## What Changes

- `/child/young/transfer` — recipient picker (enabled `transferRecipients` only), presets 100/300/500 AMD, CTA per recipient.
- `transferChildToRecipient` debits card, credits parent wallet, records `childToParent` with `transferRecipientId`.
- Parent add/toggle recipients on limits updates child list automatically (shared demo state).

### Non-goals

- Teen transfer UI, real P2P, per-recipient wallets.

### Acceptance

- Young → transfer → pay enabled recipient; new parent recipient appears when enabled; `npm run build`.

## Capabilities

- `child-young-transfer` (new)
