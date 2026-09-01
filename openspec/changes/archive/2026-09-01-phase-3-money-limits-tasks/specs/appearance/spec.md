## ADDED Requirements

### Requirement: Demo settings panel is shared

Bank, language, and demo-reset controls SHALL be implemented once in `DemoSettingsPanel` and reused on `/child/profile` and `/appearance`.

#### Scenario: Same controls on profile and appearance

- **WHEN** the user switches bank on `/child/profile`
- **THEN** the theme updates identically to switching bank on `/appearance`

## MODIFIED Requirements

### Requirement: Appearance remains reachable

The demo settings (bank, language, reset) SHALL be reachable in one tap from the child chat icon on any child screen, from the profile card on home, and from hub. The standalone `/appearance` route SHALL remain for the parent shell header button.

#### Scenario: Settings from chat icon

- **WHEN** the user taps the chat icon on any child page header
- **THEN** `/child/profile` opens with full demo settings including role toggle

#### Scenario: Appearance from parent shell

- **WHEN** the user is on the parent shell and taps the appearance control in the header
- **THEN** `/appearance` opens with bank, language, and reset (no role toggle per existing rule)
