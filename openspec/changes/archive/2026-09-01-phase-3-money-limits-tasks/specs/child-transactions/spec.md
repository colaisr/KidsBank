## Purpose

Shows the child's transaction history from demo state on the Transactions tab instead of a placeholder.

## ADDED Requirements

### Requirement: Child transactions page lists demo history

The `/child/transactions` route SHALL render a chronological list of transactions from `kidsbank.demo`, newest first.

#### Scenario: Transactions visible

- **WHEN** the user opens `/child/transactions`
- **THEN** persisted demo transactions are shown with localized labels and formatted AMD amounts

#### Scenario: Empty history

- **WHEN** no transactions exist in demo state
- **THEN** a localized empty state is shown

### Requirement: New money actions append transactions

Transfers, demo spends, and goal redemptions SHALL append entries readable on the child transactions page.

#### Scenario: Transfer appears in history

- **WHEN** a parent-to-child transfer completes
- **THEN** the child transactions list includes the new entry after navigation or refresh
