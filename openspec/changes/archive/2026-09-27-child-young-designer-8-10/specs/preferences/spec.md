## MODIFIED Requirements

### Requirement: Child experience persists in localStorage

The system SHALL read and write `childExperience` (`young` | `youngDesigner` | `teen`) to `kidsbank.childExperience`. Demo scenario reset SHALL NOT clear this key. When reading storage, if `kidsbank.childExperience` is `young` and `kidsbank.childAgeRange` is `8-10`, the effective experience SHALL be `youngDesigner`.

#### Scenario: Young experience survives refresh

- **WHEN** the user selects age `6-8` in onboarding and reloads the app
- **THEN** `/child` still shows the young home (6–8 layout) without the tab bar

#### Scenario: Designer experience survives refresh

- **WHEN** the user selects age `8-10` in onboarding and reloads the app
- **THEN** `/child` still shows the designer handoff child UI without the tab bar

#### Scenario: Default is teen

- **WHEN** no `kidsbank.childExperience` key exists
- **THEN** the app behaves as teen (current Junior home and tab bar)
