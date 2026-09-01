# child-nav Specification

## Purpose

Gives the child cabinet bottom navigation matching the AMIO Junior mockup IA in both bank themes.

## Requirements

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
- **THEN** `/child/hub` is shown with demo spend/transfer actions

### Requirement: Center FAB uses theme accent

The center FAB SHALL use AMIO Casablanca (`--kb-fab`) or Evoca violet per active theme.

#### Scenario: FAB in AMIO

- **WHEN** theme is AMIO
- **THEN** the FAB uses the Casablanca accent token

### Requirement: Demo settings reachable from chat icon on every child screen

The child cabinet SHALL expose a chat-icon control in the top-right of the home header and every child sub-page header. Tapping it SHALL open `/child/profile` (demo settings) in one tap without a full page reload.

#### Scenario: Open settings from home

- **WHEN** the user taps the chat icon on the child home header
- **THEN** `/child/profile` opens with bank, language, role, and reset controls

#### Scenario: Open settings from goals

- **WHEN** the user taps the chat icon on `/child/goals`
- **THEN** `/child/profile` opens

### Requirement: Profile settings remembers return path

Navigating to `/child/profile` SHALL pass the current pathname in router state. The profile header SHALL show a back control that returns to that path.

#### Scenario: Back to goals after settings

- **WHEN** the user opens settings from `/child/goals` and taps back
- **THEN** `/child/goals` is shown again

#### Scenario: Back defaults to home

- **WHEN** the user opens `/child/profile` directly without router state
- **THEN** the back control navigates to `/child`

### Requirement: Profile page is the unified child demo settings hub

`/child/profile` SHALL include role toggle, bank selector, language selector, and demo reset on one screen. The profile settings header SHALL NOT show the chat icon (user is already in settings).

#### Scenario: All presenter controls on profile

- **WHEN** the user views `/child/profile`
- **THEN** role, bank, language, and «Сбросить сценарий» are visible without navigating to a second screen
