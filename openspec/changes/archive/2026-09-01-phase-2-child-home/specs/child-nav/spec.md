## Purpose

Gives the child cabinet bottom navigation matching the AMIO Junior mockup IA in both bank themes.

## ADDED Requirements

### Requirement: Child cabinet has Junior bottom navigation

While the child role is active (except on Appearance), the system SHALL show bottom navigation: home, goals, center FAB (hub), transactions, and pet. Tab set SHALL be identical for AMIO and Evoca.

#### Scenario: Junior tabs on child home

- **WHEN** the user is on the child home
- **THEN** bottom navigation shows home, goals, center FAB, transactions, and pet

#### Scenario: Same tabs in Evoca

- **WHEN** theme is Evoca and the child cabinet is open
- **THEN** the tab set matches AMIO

### Requirement: Tabs switch child sections without reload

Selecting a bottom-nav tab SHALL navigate via client-side routing without a full browser reload.

#### Scenario: Open goals tab

- **WHEN** the user taps the goals tab
- **THEN** `/child/goals` is shown and the goals tab is active

#### Scenario: Open hub FAB

- **WHEN** the user taps the center FAB
- **THEN** `/child/hub` is shown

### Requirement: Center FAB uses theme accent

The center FAB SHALL use AMIO Casablanca (`--kb-fab`) or Evoca violet per active theme.

#### Scenario: FAB in AMIO

- **WHEN** theme is AMIO
- **THEN** the FAB uses the Casablanca accent token

### Requirement: Appearance remains reachable

The Appearance screen SHALL remain reachable in one tap from profile settings or hub.

#### Scenario: Appearance from profile

- **WHEN** the user opens profile from the home profile card
- **THEN** they can reach Appearance in one more tap
