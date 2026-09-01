## MODIFIED Requirements

### Requirement: Child home shows account card and piggy in AMD

The accounts section SHALL show a themed product card with masked number and AMD balance that links to `/child/card-design`, plus a piggy-bank tile with AMD balance that links to `/child/piggy`.

#### Scenario: Card and piggy formatted

- **WHEN** locale changes on Appearance
- **THEN** AMD amounts reformat with `Intl` for the active locale

#### Scenario: Piggy links to piggy screen

- **WHEN** the user taps the piggy tile on the child home
- **THEN** `/child/piggy` opens

#### Scenario: Card links to card design

- **WHEN** the user taps the product card on the child home
- **THEN** `/child/card-design` opens
