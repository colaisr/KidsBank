## MODIFIED Requirements

### Requirement: Parent routes support nested screens

The parent shell SHALL nest `/parent/limits` and `/parent/tasks` alongside geolocation and transfer, hiding index chrome on those sub-screens.

#### Scenario: Parent tasks route

- **WHEN** the user navigates to `/parent/tasks`
- **THEN** the tasks page renders in the shell outlet

#### Scenario: Parent limits route

- **WHEN** the user navigates to `/parent/limits`
- **THEN** the limits page renders in the shell outlet
