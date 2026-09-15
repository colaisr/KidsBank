# child-young-star-account Specification

## Purpose
TBD - created by archiving change child-young-star-account. Update Purpose after archive.

## Requirements

### Requirement: Young star account screen

When `childExperience` is `young`, the system SHALL provide a star account screen listing star earnings sources instead of the goals catalog.

#### Scenario: Open from young home

- **WHEN** the user taps the star account row on young home
- **THEN** `/child/young/stars` shows balance context and earning sources

#### Scenario: Teen goals preserved

- **WHEN** `childExperience` is `teen` and the user opens `/child/goals`
- **THEN** the existing goals experience is shown

#### Scenario: Young blocked from goals route

- **WHEN** `childExperience` is `young` and the user opens `/child/goals`
- **THEN** the user is redirected to the young star account screen
