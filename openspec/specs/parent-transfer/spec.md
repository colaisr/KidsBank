# parent-transfer Specification

## Purpose

Provides a full-screen parent-to-child money transfer flow (card or piggy) with amount presets and demo recurring UI for investor presentations.

## Requirements

### Requirement: Parent transfer screen is reachable

The system SHALL expose route `/parent/transfer` when role is parent. The screen SHALL include a back control to `/parent`, a localized title naming the active child (e.g. «Перевод {{name}}»), and a presenter info badge with `presenterId` `parent-transfer`.

#### Scenario: Open transfer from parent home

- **WHEN** the parent taps the transfer service row on `/parent`
- **THEN** `/parent/transfer` opens with amount entry and target segment

#### Scenario: Return to parent home

- **WHEN** the parent taps back on `/parent/transfer`
- **THEN** navigation returns to `/parent`

### Requirement: Parent chooses transfer target and amount

The transfer screen SHALL let the parent choose target **card** or **piggy** and an amount in AMD using presets (200, 500, 1000) and a custom amount entry. The screen SHALL show the parent wallet balance and SHALL disable the primary action when the amount exceeds the wallet or is zero.

#### Scenario: Transfer to card

- **WHEN** the parent selects card, amount 500, and confirms
- **THEN** demo state debits parent wallet and credits child card per `money-flow`

#### Scenario: Transfer to piggy

- **WHEN** the parent selects piggy, amount 500, and confirms
- **THEN** demo state debits parent wallet and credits child piggy per `money-flow`

#### Scenario: Insufficient parent wallet

- **WHEN** the amount exceeds `parentWallet`
- **THEN** the primary action is disabled or shows insufficient-funds feedback without mutating balances

### Requirement: Recurring transfer is demo-only UI

The transfer screen SHALL expose a recurring-transfer toggle and a periodicity row opening a bottom sheet with localized frequency options. Toggling or selecting frequency SHALL NOT schedule real transfers or persist schedule beyond the session unless explicitly added later.

#### Scenario: Periodicity sheet

- **WHEN** recurring is enabled and the parent opens periodicity
- **THEN** a sheet lists at least weekly and monthly demo options in the active locale

### Requirement: Transfer screen uses bank theme tokens

The transfer screen SHALL use one layout for AMIO and Evoca. Primary CTA SHALL use the theme header gradient token; controls SHALL use `--kb-*` / Tailwind theme aliases without child-only styling.

#### Scenario: Theme switch on transfer

- **WHEN** the user switches bank theme on `/parent/transfer`
- **THEN** structure and control order remain identical; only colors update
