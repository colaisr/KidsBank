## MODIFIED Requirements

### Requirement: P0 screens expose presenter sheets

The following routes SHALL include a presenter info badge and sheet: `/child`, `/child/tasks`, `/child/goals`, `/child/piggy`, `/child/card-design`, `/child/transactions`, `/child/pet`, `/child/hub`, `/child/onboarding/age`, `/parent`, `/parent/geolocation`, and `/appearance`.

#### Scenario: Child home presenter sheet

- **WHEN** the user taps the info badge on `/child`
- **THEN** the sheet with `presenterId` `child-home` opens

#### Scenario: Parent home presenter sheet

- **WHEN** the user taps the info badge on `/parent`
- **THEN** the sheet with `presenterId` `parent-home` opens

#### Scenario: Parent geolocation presenter sheet

- **WHEN** the user taps the info badge on `/parent/geolocation`
- **THEN** the sheet with `presenterId` `parent-geolocation` opens

#### Scenario: Onboarding age presenter sheet

- **WHEN** the user taps the info badge on `/child/onboarding/age`
- **THEN** the sheet with `presenterId` `onboarding-age` opens

## ADDED Requirements

### Requirement: Parent home demo steps include geolocation

The `parent-home` presenter sheet demo steps SHALL include at least one step directing the presenter to open geolocation and show spend markers on the map.

#### Scenario: Parent home script mentions map

- **WHEN** the user opens the presenter sheet on `/parent` in Russian
- **THEN** demo steps reference opening geolocation and contextual spend markers
