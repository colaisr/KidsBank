# child-young-designer-amio-theme Specification

## Purpose
TBD - created by archiving change child-young-designer-amio-theme. Update Purpose after archive.

## Requirements

### Requirement: Designer child respects bank theme

When `childExperience` is `youngDesigner`, the designer child shell SHALL use AMIO brand tokens when `html[data-theme]` is `amio` and Evoca handoff tokens when `evoca`.

#### Scenario: Toggle bank on profile

- **WHEN** the user switches bank on `/child/profile` while on designer child home
- **THEN** primary accents update without full page reload (token repaint)

### Requirement: Card design syncs with kidsbank card skin

When `childExperience` is `youngDesigner`, the selected card design id SHALL stay aligned with `kidsbank.cardSkin` for ids `ocean`, `space`, `leo`, and `jungle`.

#### Scenario: Young card skin applies to designer

- **WHEN** the user sets card skin on young 6–8 and opens designer 8–10
- **THEN** the home card shows the same design id
