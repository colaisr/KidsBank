## MODIFIED Requirements

### Requirement: Card design screen is reachable from child home

The system SHALL expose `/child/card-design` with a back control returning to `/child`. When `childExperience` is `young`, the screen SHALL follow `child-young-card-design` instead of the six-skin teen layout.

#### Scenario: Open from home card

- **WHEN** the user taps the product card on the child home accounts section
- **THEN** `/child/card-design` opens

#### Scenario: Teen six-skin layout preserved

- **WHEN** `childExperience` is `teen` and the user opens `/child/card-design`
- **THEN** the info banner and six skin tiles are shown as before

#### Scenario: Back to home

- **WHEN** the user taps back on the card design screen
- **THEN** `/child` opens without applying a pending unconfirmed selection
