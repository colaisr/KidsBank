## Purpose

Persists mutable demo scenario state for live presentations and allows resetting to baseline without changing bank, language, or role.

## ADDED Requirements

### Requirement: Demo scenario state is persisted locally

The system SHALL store demo scenario state in `localStorage` under `kidsbank.demo`, separate from `kidsbank.bank`, `kidsbank.lang`, and `kidsbank.role`.

#### Scenario: State survives reload

- **WHEN** demo state has been written and the page reloads
- **THEN** balances, tasks, and goals restore from `kidsbank.demo`

#### Scenario: Missing key uses baseline

- **WHEN** `kidsbank.demo` is absent or invalid
- **THEN** the app initializes from `DEMO_BASELINE` in `demoBaseline.ts`

### Requirement: Appearance offers scenario reset

The appearance screen SHALL include a control to reset the demo scenario to baseline.

#### Scenario: Reset demo from Appearance

- **WHEN** the user taps «Сбросить сценарий» on Appearance
- **THEN** `kidsbank.demo` is cleared and UI shows `DEMO_BASELINE` values

#### Scenario: Reset does not change presentation prefs

- **WHEN** the user resets the demo scenario
- **THEN** bank, locale, and role remain unchanged

### Requirement: Demo state covers star economy display fields

Demo state SHALL include at minimum: card balance, piggy balance, `starsBalance`, task list with `rewardStars` and `statusId`, and goals with `currentStars` and `targetStars`.

#### Scenario: Star fields in state

- **WHEN** the child home reads demo state
- **THEN** star balance and goal progress come from the same persisted object
