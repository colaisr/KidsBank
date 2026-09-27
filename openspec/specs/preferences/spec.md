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

### Requirement: Card skin persists in localStorage

The system SHALL read and write the active card skin to `localStorage` key `kidsbank.cardSkin` on every change.

#### Scenario: Card skin survives refresh

- **WHEN** the user applies `unicorns` skin and reloads the page
- **THEN** the app restores `unicorns` as the active card skin

### Requirement: Demo reset restores default card skin

«Сбросить сценарий» SHALL reset the active card skin to `ocean` along with demo scenario state. Bank, locale, and role SHALL remain unchanged.

#### Scenario: Reset restores ocean skin

- **WHEN** the user resets the demo scenario from Appearance or profile settings while a non-default skin is active
- **THEN** `kidsbank.cardSkin` becomes `ocean` and child accent styling returns to the default skin

### Requirement: Card skin is independent of bank and locale

Card skin, bank theme, and locale preferences SHALL be stored and applied independently. Any combination is valid.

#### Scenario: Evoca with racing skin

- **WHEN** the user selects Evoca bank and `racing` card skin
- **THEN** both preferences apply simultaneously

### Requirement: Child experience persists in localStorage

The system SHALL read and write `childExperience` (`young` | `youngDesigner` | `teen`) to `kidsbank.childExperience`. Demo scenario reset SHALL NOT clear this key. When reading storage, if `kidsbank.childExperience` is `young` and `kidsbank.childAgeRange` is `8-10`, the effective experience SHALL be `youngDesigner`.

#### Scenario: Young experience survives refresh

- **WHEN** the user selects age `6-8` in onboarding and reloads the app
- **THEN** `/child` still shows the young home (6–8 layout) without the tab bar

#### Scenario: Designer experience survives refresh

- **WHEN** the user selects age `8-10` in onboarding and reloads the app
- **THEN** `/child` still shows the designer handoff child UI without the tab bar

#### Scenario: Default is teen

- **WHEN** no `kidsbank.childExperience` key exists
- **THEN** the app behaves as teen (current Junior home and tab bar)
