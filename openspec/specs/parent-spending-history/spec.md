# parent-spending-history Specification

## Purpose

Parent-facing list of child card purchases with month summary for the demo.

## Requirements

### Requirement: Parent spending history screen is reachable

The system SHALL expose `/parent/spending-history` with back to `/parent` and localized title «История трат».

#### Scenario: Open from services

- **WHEN** the parent taps the spending history service row
- **THEN** the spending history screen opens with month summary and transaction groups

### Requirement: Month summary shows spend total

The screen SHALL show a card with localized «spent this month» copy, total AMD for demo `spend` transactions in the current calendar month, and a compact category donut aligned with month report demo slices.

#### Scenario: Summary visible

- **WHEN** the parent opens spending history
- **THEN** month spent amount and mini chart are visible above the list

### Requirement: Purchases grouped by day

The list SHALL include only child **spend** transactions (AMD debits), sorted newest first, grouped under **today**, **yesterday**, and **earlier** with localized section headers; each row shows merchant/title and clock time.

#### Scenario: Today and yesterday groups

- **WHEN** demo includes spends today and yesterday
- **THEN** sections appear with matching rows and times
