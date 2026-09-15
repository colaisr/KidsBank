# child-young-phone-topup Specification

## Purpose
TBD - created by archiving change child-young-phone-topup. Update Purpose after archive.

## Requirements

### Requirement: Young phone top-up screen

When `childExperience` is `young`, the system SHALL provide `/child/young/phone-topup` with back to `/child`, localized title «Top up phone», a card showing the demo child masked phone number, selectable preset amounts 500 / 1000 / 2000 AMD, a large amount display, and primary CTA «Top up».

#### Scenario: Open from young home

- **WHEN** the user taps the phone top-up quick action on the young home
- **THEN** `/child/young/phone-topup` is shown

#### Scenario: Complete demo top-up

- **WHEN** the user taps the primary CTA with sufficient card balance
- **THEN** the card balance decreases by the selected amount, a spend transaction is recorded, and the user returns to `/child`

#### Scenario: Teen cannot open young route

- **WHEN** `childExperience` is `teen` and the user navigates to `/child/young/phone-topup`
- **THEN** the user is redirected to `/child`
