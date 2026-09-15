## MODIFIED Requirements

### Requirement: Child cabinet has Junior bottom navigation

While the child role is active (except on Appearance), the system SHALL show bottom navigation on teen experience: home, goals, center FAB (hub), transactions, and pet. Tab set SHALL be identical for AMIO and Evoca. When `childExperience` is `young`, the tab bar SHALL NOT be shown on child routes (except onboarding full-screen steps and future young-specific overrides).

#### Scenario: Junior tabs on child home

- **WHEN** `childExperience` is `teen` and the user is on the child home
- **THEN** bottom navigation shows home, goals, center FAB, transactions, and pet

#### Scenario: Same tabs in Evoca

- **WHEN** theme is Evoca, `childExperience` is `teen`, and the child cabinet is open
- **THEN** the tab set matches AMIO

#### Scenario: Tab bar hidden for young

- **WHEN** `childExperience` is `young` and the user is on `/child`
- **THEN** the bottom tab bar is not visible
