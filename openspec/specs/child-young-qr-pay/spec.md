# child-young-qr-pay Specification

## Purpose
TBD - created by archiving change child-young-qr-pay. Update Purpose after archive.

## Requirements

### Requirement: Young QR payment flow

When `childExperience` is `young`, the system SHALL provide `/child/young/qr-pay` with a simulated QR scan (~5–6 seconds), a confirmation step showing merchant and amount, and a demo spend on confirm.

#### Scenario: Open from young home

- **WHEN** the user taps the QR quick action on young home
- **THEN** the QR pay screen opens and scanning simulation starts

#### Scenario: Confirm payment

- **WHEN** scanning completes and the user confirms
- **THEN** the card balance decreases by the demo QR amount and a QR-style spend transaction is recorded

#### Scenario: Teen redirect

- **WHEN** `childExperience` is `teen` and the user opens `/child/young/qr-pay`
- **THEN** the user is redirected to `/child`
