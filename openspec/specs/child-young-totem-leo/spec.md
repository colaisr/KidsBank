# child-young-totem-leo Specification

## Purpose
TBD - created by archiving change child-young-totem-leo. Update Purpose after archive.

## Requirements

### Requirement: Young Leo totem

When `childExperience` is `young`, the totem dock and `/child/young/totem` SHALL show an animated lion cub mascot Leo with idle motion and tap feedback.

#### Scenario: Open totem

- **WHEN** the user taps the lion on young home
- **THEN** the totem screen shows Leo with Play and Talk actions

#### Scenario: Tap feedback

- **WHEN** the user taps Leo or Play/Talk
- **THEN** a short happy animation plays and a demo message may appear

#### Scenario: Teen redirect

- **WHEN** a teen user opens `/child/young/totem`
- **THEN** they are redirected to `/child`
