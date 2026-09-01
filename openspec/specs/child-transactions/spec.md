# child-transactions Specification

## Purpose

Shows the child's transaction history from demo state on the Transactions tab instead of a placeholder.

## Requirements

### Requirement: Child transactions page lists demo history

The `/child/transactions` route SHALL render transactions from `kidsbank.demo` newest first, grouped under localized day headers (today, yesterday, earlier). Each row SHALL show a category icon, localized title, relative time subtitle, and signed amount in AMD or ★ according to transaction `currency`. The page SHALL include a gradient header matching the child home pattern (star link to goals, title, presenter ℹ️ badge, settings link), a three-way filter (all / income / expenses), and a week summary chip showing aggregated +AMD, −AMD, and +★ for transactions in the current calendar week.

#### Scenario: Transactions visible

- **WHEN** the user opens `/child/transactions`
- **THEN** persisted demo transactions are shown with localized labels, formatted AMD or ★ amounts, day grouping, and category icons

#### Scenario: Transactions visible with grouping

- **WHEN** the user opens `/child/transactions`
- **THEN** persisted demo transactions appear in day groups with icons, times, and formatted AMD or ★ amounts

#### Scenario: Empty history

- **WHEN** no transactions exist in demo state
- **THEN** a localized empty state is shown

#### Scenario: Filter income

- **WHEN** the user selects the income filter
- **THEN** only credit AMD transactions and star task rewards are shown

#### Scenario: Filter expenses

- **WHEN** the user selects the expenses filter
- **THEN** only debit AMD transactions are shown; star rewards are hidden

#### Scenario: Week summary updates

- **WHEN** a new spend or transfer completes in the demo session
- **THEN** the week summary chip reflects the new totals without a full page reload beyond demo state refresh

### Requirement: New money actions append transactions

Transfers, demo spends, goal redemptions, internal card↔piggy moves, and parent-confirmed task rewards SHALL append entries readable on the child transactions page.

#### Scenario: Transfer appears in history

- **WHEN** a parent-to-child transfer completes
- **THEN** the child transactions list includes the new entry after navigation or refresh

#### Scenario: Piggy to card in history

- **WHEN** the child withdraws from piggy to card
- **THEN** a `piggyToCard` row appears in the child transactions list

#### Scenario: Task reward in history

- **WHEN** the parent confirms a completed task
- **THEN** a `taskReward` row with ★ amount and task title appears in the child transactions list

#### Scenario: QR spend with merchant

- **WHEN** the child completes a hub demo purchase
- **THEN** a `spend` row shows localized QR label with merchant name from `merchantKey`
