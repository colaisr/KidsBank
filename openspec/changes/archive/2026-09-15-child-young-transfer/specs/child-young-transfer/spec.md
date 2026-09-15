## ADDED Requirements

### Requirement: Young money transfer screen

When `childExperience` is `young`, the system SHALL provide `/child/young/transfer` listing only `transferRecipients` with `enabled: true`, amount presets, and a transfer action that debits the child card.

#### Scenario: Recipients from parent limits

- **WHEN** a parent enables or adds a transfer recipient on the limits screen
- **THEN** that recipient appears on the young transfer screen (disabled recipients are hidden)

#### Scenario: Successful transfer

- **WHEN** the child confirms a transfer within balance and recipient rules
- **THEN** the card balance decreases and a transfer transaction is recorded with the recipient context

#### Scenario: Teen redirect

- **WHEN** `childExperience` is `teen` and the user opens `/child/young/transfer`
- **THEN** the user is redirected to `/child`
