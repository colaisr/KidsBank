## Purpose

Keeps designer handoff demo state aligned with `kidsbank.demo` for reset, parent workflows, and transaction history.

## ADDED Requirements

### Requirement: Scenario reset clears handoff storage

When the user taps scenario reset on `/child/profile`, the system SHALL remove `evoca-demo-v2` and `evoca-card-design` from localStorage, reset designer entry sync tracking, and rehydrate handoff state from the current `kidsbank.demo` baseline.

#### Scenario: Reset after child spend

- **WHEN** the child spends money in the designer flow and the user resets the scenario
- **THEN** card balance and designer UI match the demo baseline again

### Requirement: Designer money actions append KidsBank transactions

When `childExperience` is `youngDesigner`, new designer `entries` that represent card spend, piggy moves, or star rewards SHALL append corresponding rows to `kidsbank.demo.transactions` exactly once per entry id.

#### Scenario: QR pay appears in transaction list

- **WHEN** the child completes a demo QR payment in the designer flow
- **THEN** a new spend transaction exists in `kidsbank.demo.transactions`

#### Scenario: Piggy deposit from card

- **WHEN** the child moves AMD from card to piggy in the designer savings flow
- **THEN** a `cardToPiggy` (or equivalent) transaction is recorded in `kidsbank.demo.transactions`
