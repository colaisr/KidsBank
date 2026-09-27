# child-young-home Specification

## Purpose
TBD - created by archiving change child-young-home. Update Purpose after archive.

## Requirements

### Requirement: Young child home layout

When `childExperience` is `young`, the child home at `/child` SHALL show: a gradient header with child name and star balance; product card with AMD balance; three quick-action tiles (phone top-up, QR pay, transfer) as non-navigating controls; piggy and star-account rows; a tasks section with at least one compact task card; and a bottom dock with only a lion totem affordance (no play/talk buttons on home).

#### Scenario: Young home after onboarding

- **WHEN** the user completes onboarding with age `6-8` and taps Continue
- **THEN** `/child` shows the young home layout and the child tab bar is hidden

#### Scenario: Quick actions are visual only

- **WHEN** the user taps a quick-action tile on the young home for age `6-8`
- **THEN** navigation opens the corresponding young demo route (`/child/young/phone-topup`, `/child/young/qr-pay`, or `/child/young/transfer`)

### Requirement: Lion totem opens placeholder hub route

The young home lion totem SHALL be tappable and navigate to `/child/young/totem`.

#### Scenario: Open totem placeholder

- **WHEN** the user taps the lion on the young home dock
- **THEN** `/child/young/totem` is shown with a way to return to `/child`
