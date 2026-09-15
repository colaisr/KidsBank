## ADDED Requirements

### Requirement: Age choice drives child experience

The system SHALL map the selected onboarding age range to `childExperience` when the user taps Continue: `6-8` and `8-10` → `young`; `10-12`, `12-14`, and `14-17` → `teen`. The mapping SHALL be persisted to `kidsbank.childExperience` and the selected range to `kidsbank.childAgeRange`. Demo balances and tasks in `kidsbank.demo` SHALL remain unchanged by age selection alone.

#### Scenario: Continue after young age selection

- **WHEN** the user selects `8-10` and taps Continue
- **THEN** the young child home is shown and `kidsbank.childExperience` is `young`

#### Scenario: Continue after teen age selection

- **WHEN** the user selects `10-12` and taps Continue
- **THEN** the existing teen child home is shown with the tab bar

#### Scenario: Demo data unchanged by age alone

- **WHEN** the user selects any age range and taps Continue
- **THEN** the child home is shown and demo balances, tasks, and limits are unchanged from before entering onboarding

#### Scenario: Re-enter onboarding restores selection

- **WHEN** the user opens the age screen again after a prior Continue
- **THEN** the previously selected age range is pre-selected

## REMOVED Requirements

### Requirement: Age choice does not affect demo state

**Reason:** Age now drives shell and home layout via `childExperience`, not demo v5 fields.

**Migration:** Replaced by «Age choice drives child experience»; demo entity data still unchanged on age alone.
