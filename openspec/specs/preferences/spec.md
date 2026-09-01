# preferences Specification

## Purpose
Persists and restores user choices for bank theme and locale across sessions and shareable URLs.

## Requirements

### Requirement: Bank and locale persist in localStorage

The system SHALL read and write the active bank (`amio` | `evoca`) and locale (`hy` | `ru` | `en`) to `localStorage` on every change.

#### Scenario: Preference survives refresh

- **WHEN** the user sets Evoca + Armenian and reloads the page
- **THEN** the app restores `evoca` theme and `hy` locale

### Requirement: URL query parameters mirror preferences

The system SHALL support `?bank=<amio|evoca>&lang=<hy|ru|en>` query parameters. Valid query values SHALL override stored preferences on initial load and SHALL be written back to `localStorage`.

#### Scenario: Deep link overrides storage

- **WHEN** the user opens `?bank=evoca&lang=en` with `amio` + `ru` in localStorage
- **THEN** the app starts in Evoca + English and updates localStorage to match

#### Scenario: URL updates on preference change

- **WHEN** the user changes bank or language in the app
- **THEN** the browser URL query parameters update via `history.replaceState` without navigation reload

### Requirement: Bank and locale are independent

Theme and locale preferences SHALL be stored and applied independently. Any combination of bank and locale is valid.

#### Scenario: Evoca with Armenian

- **WHEN** the user selects Evoca bank and Armenian language
- **THEN** both preferences apply simultaneously with no coupling constraint

### Requirement: Role preference persists separately

The active role (`child` | `parent`) SHALL persist in `localStorage` independently of bank and locale.

#### Scenario: Role survives refresh

- **WHEN** the user switches to parent role and reloads
- **THEN** the parent shell is shown after reload
