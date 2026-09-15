# parent-limits Specification

## Purpose

Lets the parent configure demo limits for child P2P transfer recipients and daily ATM cash withdrawal for family-banking presentations.

## Requirements

### Requirement: Parent limits screen is reachable

The system SHALL expose `/parent/limits` with back to `/parent` and localized title «Лимиты».

#### Scenario: Open from services

- **WHEN** the parent taps the limits service row
- **THEN** the limits screen opens with transfer recipients and cash sections

### Requirement: Parent configures transfer recipients demo

The limits screen SHALL list demo transfer recipients with per-recipient enable toggles and daily limit copy. The parent SHALL add a custom recipient via a bottom sheet (name + daily limit presets).

#### Scenario: Toggle recipient

- **WHEN** the parent disables a recipient
- **THEN** demo state persists `enabled: false` for that id

### Requirement: Parent configures cash withdrawal demo

The limits screen SHALL expose allow-cash toggle, daily amount stepper bounded by `maxDaily`, and a progress indicator toward the maximum.

#### Scenario: Adjust ATM limit

- **WHEN** the parent taps + on the cash stepper
- **THEN** `cashWithdrawal.dailyLimit` increases by the demo step without exceeding `maxDaily`
