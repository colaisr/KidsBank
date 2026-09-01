## Purpose

Lets demo presenters switch between child and parent cabinet shells as separate personas while sharing the same theme and locale.

## ADDED Requirements

### Requirement: Two role shells exist

The system SHALL provide a child cabinet shell and a parent cabinet shell. Each shell is a placeholder home view for its role, ready for phase-2 content.

#### Scenario: Child shell content

- **WHEN** the active role is `child`
- **THEN** the child shell displays a localized title, demo child name from `demo.*`, and empty-state placeholder text

#### Scenario: Parent shell content

- **WHEN** the active role is `parent`
- **THEN** the parent shell displays a localized title and empty-state placeholder text distinct from the child shell

### Requirement: Role switcher is separate from bank and language

The system SHALL expose a dedicated role control (child / parent) that does not live on the appearance screen and does not change bank or locale.

#### Scenario: Role switch preserves theme

- **WHEN** the user switches from child to parent while Evoca + hy is active
- **THEN** theme remains Evoca and locale remains hy; only the shell content changes

### Requirement: Role shells respect active theme

Both shells SHALL use the same layout components and theme tokens. Child shell MAY use kids-accent tokens; parent shell MAY use a calmer adult-banking tone — both within the active bank theme.

#### Scenario: Child shell in AMIO

- **WHEN** role is child and theme is AMIO
- **THEN** child shell uses AMIO tokens including kids accent (e.g. Casablanca) where appropriate

#### Scenario: Parent shell in Evoca

- **WHEN** role is parent and theme is Evoca
- **THEN** parent shell uses Evoca violet primary with adult-oriented spacing, not a separate layout fork

### Requirement: Role switch without full page reload

Switching role SHALL update the visible shell without a full browser reload.

#### Scenario: Toggle role in place

- **WHEN** the user taps the parent role control
- **THEN** the parent shell replaces the child shell via client-side navigation or state update
