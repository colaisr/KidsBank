## ADDED Requirements

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
