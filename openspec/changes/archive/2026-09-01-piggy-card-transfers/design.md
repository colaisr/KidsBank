## Context

`child-piggy-bank` archived: экран копилки, share-link, пополнения. Родитель→копилка уже есть. Нужен внутренний перевод карта↔копилка только на `/child/piggy`.

## Goals / Non-Goals

**Goals:** две кнопки под hero-балансом; `PiggyTransferModal` с mode `toPiggy | toCard`; pure actions; feedback banner.

**Non-goals:** главная, hub, parent UI, card limit on internal transfer.

## Decisions

### 1. UI placement

Под «Всего скоплено», над share-card:

```
[ Положить с карты ] [ Вывести на карту ]
```

`grid grid-cols-2 gap-3` — primary outline buttons.

### 2. Actions

```ts
transferCardToPiggy(state, amount)  // card↓ piggy↑, tx cardToPiggy
transferPiggyToCard(state, amount)    // piggy↓ card↑, tx piggyToCard
```

Validation: `amount > 0`, source balance sufficient. No `cardLimit` check.

### 3. History

- `isPiggyDeposit` extended with `cardToPiggy`
- `piggyToCard` only in `/child/transactions` (debit styling on piggy flow = credit to card → `isCredit` true)

### 4. Modal

`PiggyTransferModal`: props `mode`, `open`, `onClose`, `onSuccess`. Reuses preset pattern from `TransferModal`. Source balance line: card or piggy depending on mode.

## Risks

| Risk | Mitigation |
|------|------------|
| Duplicate modal logic | Shared PRESETS constant or small shared hook later; for now mirror TransferModal (~70 lines) |
