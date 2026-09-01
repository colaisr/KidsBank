## ADDED Requirements

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
