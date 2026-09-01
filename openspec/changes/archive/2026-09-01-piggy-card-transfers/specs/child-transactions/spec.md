## MODIFIED Requirements

### Requirement: New money actions append transactions

Transfers, demo spends, goal redemptions, and internal card↔piggy moves SHALL append entries readable on the child transactions page.

#### Scenario: Transfer appears in history

- **WHEN** a parent-to-child transfer completes
- **THEN** the child transactions list includes the new entry after navigation or refresh

#### Scenario: Piggy to card in history

- **WHEN** the child withdraws from piggy to card
- **THEN** a `piggyToCard` row appears in the child transactions list
