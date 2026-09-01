# appearance Specification

## Purpose
Provides the in-app "Оформление" screen where users switch bank theme and display language at any time during the demo.

## Requirements

### Requirement: Appearance screen is always reachable

The system SHALL expose navigation to the appearance screen from every top-level shell view in one tap (e.g. header icon or settings entry).

#### Scenario: Open from child shell

- **WHEN** the user is on the child role shell
- **THEN** a visible control opens the appearance screen

#### Scenario: Open from parent shell

- **WHEN** the user is on the parent role shell
- **THEN** the same appearance entry point is available

### Requirement: Bank selector on appearance screen

The appearance screen SHALL offer exactly two bank options: AMIO and Evoca. Selecting one SHALL immediately apply the corresponding theme.

#### Scenario: Select Evoca

- **WHEN** the user taps Evoca on the appearance screen
- **THEN** `data-theme` switches to `evoca` and the current screen re-themes in place

### Requirement: Language selector on appearance screen

The appearance screen SHALL offer exactly three language options labeled Հայերեն, Русский, and English. Selecting one SHALL immediately switch the active locale.

#### Scenario: Select Armenian

- **WHEN** the user taps Հայերեն
- **THEN** all `ui.*` and `demo.*` strings update to Armenian without page reload

### Requirement: Appearance includes demo scenario reset

In addition to bank and language controls, the appearance screen SHALL offer «Сбросить сценарий» that resets `kidsbank.demo` to baseline without changing bank, locale, or role.

#### Scenario: Reset section visible

- **WHEN** the user views Appearance
- **THEN** a demo section with reset control and hint text is shown below language

#### Scenario: Reset hint localized

- **WHEN** locale is `hy`, `ru`, or `en`
- **THEN** reset label and hint use `ui.appearance.*` keys in that locale

### Requirement: Appearance is separate from role control

The appearance screen SHALL NOT include the child/parent role switcher. Role switching MUST remain a distinct control elsewhere in the shell.

#### Scenario: No role toggle on appearance

- **WHEN** the user views the appearance screen
- **THEN** bank, language, and demo-reset controls are shown; role is unchanged

### Requirement: Appearance screen strings are localized

All labels and headings on the appearance screen SHALL use `ui.*` keys and render correctly in all three locales.

#### Scenario: Appearance in English

- **WHEN** the active locale is `en`
- **THEN** appearance screen chrome (title, section labels) displays in English
