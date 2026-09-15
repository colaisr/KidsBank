## Decisions

- Source of truth: `demo.transferRecipients` (`enabled` only on child screen).
- Amount presets in `src/data/youngTransfer.ts` (100 / 300 / 500, default 300).
- Respect `dailyLimit` per recipient (sum of today’s transfers with same `transferRecipientId`).
- Shared helpers `src/lib/transferRecipients.ts` with parent limits UI.
