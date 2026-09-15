## ADDED Requirements

### Requirement: Child experience persists in localStorage

The system SHALL read and write `childExperience` (`young` | `teen`) to `kidsbank.childExperience`. Demo scenario reset SHALL NOT clear this key.

#### Scenario: Young experience survives refresh

- **WHEN** the user selects a young age band in onboarding and reloads the app
- **THEN** `/child` still shows the young home without the tab bar

#### Scenario: Default is teen

- **WHEN** no `kidsbank.childExperience` key exists
- **THEN** the app behaves as teen (current Junior home and tab bar)
