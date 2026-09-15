## ADDED Requirements

### Requirement: Young piggy bank screen

When `childExperience` is `young`, `/child/piggy` SHALL show a simplified piggy layout with young-friendly copy while preserving deposit from card, withdraw to card, share link, and recent deposits.

#### Scenario: Young opens piggy

- **WHEN** the user opens piggy from young home
- **THEN** the young piggy screen is shown with simplified strings

#### Scenario: Transfers still work

- **WHEN** the user uses deposit or withdraw on young piggy
- **THEN** the same demo transfer flows as teen apply

#### Scenario: Teen unchanged

- **WHEN** `childExperience` is `teen`
- **THEN** the existing grouped-deposits piggy screen is shown
