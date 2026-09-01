## MODIFIED Requirements

### Requirement: Two role shells exist

The system SHALL provide a child cabinet shell and a parent cabinet shell. The child shell SHALL host the Junior child home and bottom navigation. The parent shell SHALL remain a placeholder until phase 3.

#### Scenario: Child shell content

- **WHEN** the active role is `child`
- **THEN** the child shell displays the Junior home (accounts, stars, tasks, goals) with bottom navigation, not an empty-state placeholder

#### Scenario: Parent shell content

- **WHEN** the active role is `parent`
- **THEN** the parent shell displays a localized title and empty-state placeholder text distinct from the child shell
