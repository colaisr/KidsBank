## MODIFIED Requirements

### Requirement: Parent routes nest under parent shell

The system SHALL nest parent feature routes under `/parent` using a parent shell with an outlet. Index route `/parent` SHALL render the parent home dashboard; `/parent/geolocation` SHALL render the geolocation screen; `/parent/transfer` SHALL render the transfer screen — without full page reload.

#### Scenario: Parent geolocation route

- **WHEN** the user navigates to `/parent/geolocation`
- **THEN** the parent shell remains mounted and the geolocation page renders in the outlet

#### Scenario: Parent transfer route

- **WHEN** the user navigates to `/parent/transfer`
- **THEN** the parent shell remains mounted and the transfer page renders in the outlet with sub-screen chrome (no app header / child header on index chrome)
