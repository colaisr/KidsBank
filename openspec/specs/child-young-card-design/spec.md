# child-young-card-design Specification

## Purpose
TBD - created by archiving change child-young-card-design. Update Purpose after archive.

## Requirements

### Requirement: Young card design shows four themes

When `childExperience` is `young`, `/child/card-design` SHALL show a localized subtitle, a 2×2 grid of exactly four themes (`ocean`, `space`, `leo`, `jungle`), and a primary «Done» action (`ui.childYoung.cardDesign.done`). It SHALL NOT show the teen info banner or the six-skin grid.

#### Scenario: Open from young home card

- **WHEN** the user taps the product card on the young child home
- **THEN** the young card design screen opens with four theme tiles

#### Scenario: Apply young theme

- **WHEN** the user selects a theme and taps Done
- **THEN** `kidsbank.cardSkin` updates, child accent styling reflects the skin, and the user returns to `/child`
