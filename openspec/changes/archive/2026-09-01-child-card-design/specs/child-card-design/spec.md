## Purpose

Lets the child personalize the product card appearance and shifts accent styling across the child cabinet via a selectable card skin.

## ADDED Requirements

### Requirement: Card design screen is reachable from child home

The system SHALL expose `/child/card-design` with a back control returning to `/child`.

#### Scenario: Open from home card

- **WHEN** the user taps the product card on the child home accounts section
- **THEN** `/child/card-design` opens

#### Scenario: Back to home

- **WHEN** the user taps back on the card design screen
- **THEN** `/child` opens without applying a pending unconfirmed selection

### Requirement: Card design screen shows six selectable skins

The screen SHALL display an info banner and a 2×3 grid of exactly six card skins: `ocean`, `space`, `dinosaurs`, `unicorns`, `robots`, `racing`. Each tile SHALL show a visual preview and a localized label.

#### Scenario: All skins visible

- **WHEN** the user opens `/child/card-design`
- **THEN** six skin tiles and the info banner are visible

#### Scenario: Skin labels localized

- **WHEN** locale is `hy`, `ru`, or `en`
- **THEN** each skin label uses `ui.cardDesign.skins.*` in the active locale

### Requirement: User can preview and apply a card skin

The screen SHALL highlight the currently selected skin with a checkmark. Tapping a tile SHALL update the pending selection. The primary action «Применить дизайн» SHALL persist the selected skin and navigate back to `/child`.

#### Scenario: Apply skin

- **WHEN** the user selects a skin and taps «Применить дизайн»
- **THEN** the active card skin updates, child accent styling reflects the skin, and the user returns to `/child`

#### Scenario: Selection indicator

- **WHEN** the user taps a skin tile
- **THEN** that tile shows the selected state before apply

### Requirement: Card design screen uses one layout for both banks

Bank differences on the card design screen SHALL come from CSS tokens only. Markup and skin ids SHALL be identical for AMIO and Evoca.

#### Scenario: Same skin grid in Evoca

- **WHEN** bank is Evoca on `/child/card-design`
- **THEN** the same six skins appear in the same order with bank-appropriate token previews
