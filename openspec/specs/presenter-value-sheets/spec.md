## Purpose

Defines reusable presenter value sheets (child / bank / demo script) across demo screens for investor and bank presentations.

## Requirements

### Requirement: Shared presenter value sheet component

The system SHALL provide a reusable bottom sheet opened by a muted info badge. The sheet SHALL show three sections: value for the child, value for the bank, and a short demo script. Content SHALL come from i18n keys `ui.presenter.sheets.<presenterId>.*` in hy, ru, and en.

#### Scenario: Open sheet from badge

- **WHEN** the user taps the presenter info badge on a supported screen
- **THEN** a bottom sheet opens with child, bank, and demo sections localized for the active language

### Requirement: P0 screens expose presenter sheets

The following routes SHALL include a presenter info badge and sheet: `/child`, `/child/tasks`, `/child/goals`, `/child/piggy`, `/child/card-design`, `/child/transactions`, `/child/pet`, `/child/hub`, `/child/onboarding/age`, `/parent`, and `/appearance`.

#### Scenario: Child home presenter sheet

- **WHEN** the user taps the info badge on `/child`
- **THEN** the sheet with `presenterId` `child-home` opens

#### Scenario: Parent home presenter sheet

- **WHEN** the user taps the info badge on `/parent`
- **THEN** the sheet with `presenterId` `parent-home` opens

#### Scenario: Onboarding age presenter sheet

- **WHEN** the user taps the info badge on `/child/onboarding/age`
- **THEN** the sheet with `presenterId` `onboarding-age` opens

### Requirement: Child home section-level sheets

The child home screen SHALL expose additional presenter badges on the Accounts, Tasks preview, and Goals preview section headings with `presenterId` values `child-accounts`, `child-tasks`, and `child-goals` respectively.

#### Scenario: Accounts section sheet

- **WHEN** the user taps the info badge on the Accounts section heading on `/child`
- **THEN** the focused accounts value sheet opens

### Requirement: Pet screen uses shared component

The pet screen presenter sheet SHALL use the shared presenter component with `presenterId` `child-pet`, preserving existing content semantics after key migration.

#### Scenario: Pet sheet after refactor

- **WHEN** the user taps the info badge on `/child/pet`
- **THEN** the shared sheet shows the same three sections as before refactor

### Requirement: Presenter badges are visually subtle

Presenter info badges SHALL use muted styling and SHALL NOT replace primary navigation or action controls.

#### Scenario: Badge styling

- **WHEN** any supported screen renders the presenter badge
- **THEN** the badge is small and low-contrast relative to page titles and CTAs

### Requirement: Two-layer presenter copy strategy

The `child-home` presenter sheet SHALL articulate app-level product value (daily habit, financial literacy, early LTV, family in ecosystem). All other presenter sheets SHALL frame their screen as a lever that delivers that value, without duplicating the home manifest.

#### Scenario: Home sheet is North Star

- **WHEN** the user opens the presenter sheet on `/child`
- **THEN** the title and child/bank rows describe global KidsBank value, not only screen layout

#### Scenario: Screen sheet is a lever

- **WHEN** the user opens a presenter sheet on any other supported screen
- **THEN** the title references the mechanic as a lever (e.g. tasks = family contract) and demo steps stay screen-specific

### Requirement: New features include presenter sheets by default

New screens or major product mechanics introduced via OpenSpec change SHALL include a presenter value sheet unless the proposal explicitly documents a justified skip (service hubs, layout shells, modals).

#### Scenario: Proposal without sheet

- **WHEN** a change proposes a new demo screen without a presenter sheet
- **THEN** the proposal documents the skip reason and references PlanDocs/01 and PlanDocs/17 §6
