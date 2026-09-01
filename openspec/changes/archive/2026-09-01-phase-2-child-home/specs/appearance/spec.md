## MODIFIED Requirements

### Requirement: Appearance screen is always reachable

The system SHALL expose navigation to the appearance screen from every top-level shell view in one tap (e.g. header icon or settings entry).

#### Scenario: Open from child shell

- **WHEN** the user is on the child role shell
- **THEN** a visible control opens the appearance screen

#### Scenario: Open from parent shell

- **WHEN** the user is on the parent role shell
- **THEN** the same appearance entry point is available

### Requirement: Appearance includes demo scenario reset

In addition to bank and language controls, the appearance screen SHALL offer «Сбросить сценарий» that resets `kidsbank.demo` to baseline without changing bank, locale, or role.

#### Scenario: Reset section visible

- **WHEN** the user views Appearance
- **THEN** a demo section with reset control and hint text is shown below language

#### Scenario: Reset hint localized

- **WHEN** locale is `hy`, `ru`, or `en`
- **THEN** reset label and hint use `ui.appearance.*` keys in that locale
