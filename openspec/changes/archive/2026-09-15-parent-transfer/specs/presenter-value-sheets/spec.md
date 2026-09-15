## ADDED Requirements

### Requirement: Parent transfer has presenter sheet

The system SHALL register presenter sheet id `parent-transfer` with localized child value, bank value, and demo steps in `presenter.{hy,ru,en}.json`. The transfer screen SHALL expose the presenter badge via `ChildPageTitle` / `HeaderPresenterActions`.

#### Scenario: Open parent transfer presenter

- **WHEN** the parent taps ℹ️ on `/parent/transfer`
- **THEN** the sheet with `presenterId` `parent-transfer` opens

### Requirement: Parent home presenter reflects services IA

The `parent-home` presenter demo steps SHALL include opening transfer from the services section rather than a quick-action tile.

#### Scenario: Parent home demo step

- **WHEN** the presenter reads `parent-home` demo steps in any locale
- **THEN** at least one step references Services → Transfer
