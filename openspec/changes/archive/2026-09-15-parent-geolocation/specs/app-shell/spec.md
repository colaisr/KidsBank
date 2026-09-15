## ADDED Requirements

### Requirement: Parent routes support nested screens

The system SHALL nest parent feature routes under `/parent` using a parent shell with an outlet. Index route `/parent` SHALL render the parent home dashboard; `/parent/geolocation` SHALL render the geolocation screen without full page reload.

#### Scenario: Parent geolocation route

- **WHEN** the user navigates to `/parent/geolocation`
- **THEN** the parent shell remains mounted and the geolocation page renders in the outlet

#### Scenario: Unknown parent path

- **WHEN** the user opens an unknown path under `/parent/*`
- **THEN** the app redirects to `/parent`
