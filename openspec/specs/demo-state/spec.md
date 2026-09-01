# demo-state Specification

## Purpose

Persists mutable demo scenario state for live presentations and allows resetting to baseline without changing bank, language, or role.

## Requirements

### Requirement: Demo scenario state is persisted locally

The system SHALL store demo scenario state in `localStorage` under `kidsbank.demo`, separate from `kidsbank.bank`, `kidsbank.lang`, and `kidsbank.role`. State version SHALL bump when schema changes; invalid or older versions fall back to baseline migration or reset.

#### Scenario: State survives reload

- **WHEN** demo state has been written and the page reloads
- **THEN** balances, tasks, goals, limits, and transactions restore from `kidsbank.demo`

#### Scenario: Missing key uses baseline

- **WHEN** `kidsbank.demo` is absent or invalid
- **THEN** the app initializes from `DEMO_BASELINE` in `demoBaseline.ts`

### Requirement: Appearance offers scenario reset

The appearance screen and child profile settings SHALL include a control to reset the demo scenario to baseline with visible confirmation feedback.

#### Scenario: Reset demo from Appearance

- **WHEN** the user taps «Сбросить сценарий» on Appearance
- **THEN** `kidsbank.demo` is cleared and UI shows `DEMO_BASELINE` values

#### Scenario: Reset does not change presentation prefs

- **WHEN** the user resets the demo scenario
- **THEN** bank, locale, and role remain unchanged

### Requirement: Demo state covers star economy display fields

Demo state SHALL include at minimum: card balance, piggy balance with `shareSlug`, `starsBalance`, `taskStats` (`starsEarned`, `tasksCompleted`), task list with `id`, `templateId`, optional `customTitle` (when `templateId` is `other`), `rewardStars`, `dueTime`, and `statusId`, goals with `id`, `templateId`, optional `customTitle`, `iconId`, `currentStars`, `targetStars`, `amdValue`, and `redeemed`, optional `cardLimit`, parent wallet balance, and a `transactions` array that MAY include piggy deposit type ids (`piggyCashback`, `piggyGiftMom`, `piggyGiftGrandma`, `parentToPiggy`).

#### Scenario: Star fields in state

- **WHEN** the child home reads demo state
- **THEN** star balance, task stats, and goal progress come from the same persisted object

#### Scenario: Money fields in state

- **WHEN** the parent home reads demo state
- **THEN** parent wallet, card limit, and transactions come from the same persisted object

#### Scenario: Piggy share slug in state

- **WHEN** the piggy screen reads demo state
- **THEN** `piggy.shareSlug` is available for building the demo share URL

#### Scenario: Reset includes piggy seed deposits

- **WHEN** the user resets the demo scenario
- **THEN** piggy balance, `shareSlug`, seed piggy deposit transactions, task stats, task list, and goals restore from `DEMO_BASELINE`

#### Scenario: Goal fields in state

- **WHEN** the goals page reads demo state
- **THEN** each goal exposes `templateId`, optional `customTitle`, `iconId`, star progress, and `amdValue`

#### Scenario: Task fields in state

- **WHEN** the tasks page reads demo state
- **THEN** each task exposes `templateId`, `dueTime`, and `statusId` for rendering

### Requirement: Demo state version and pet slice

Demo state version SHALL be 4. The state object SHALL include a `pet` slice with `xp`, `fullness`, `joy`, `energy`, `careCount`, `visitCount`, `taskBuff`, and `lastTickAt`. Missing `pet` in stored state SHALL be backfilled from baseline during normalization.

#### Scenario: Migrate old localStorage

- **WHEN** stored demo state has no `pet` field
- **THEN** normalization adds baseline pet values without resetting other demo data

#### Scenario: Reset includes pet

- **WHEN** the user resets the demo scenario
- **THEN** `pet` returns to baseline including `taskBuff: false`
