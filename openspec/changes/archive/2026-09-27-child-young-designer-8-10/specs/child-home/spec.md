## MODIFIED Requirements

### Requirement: Child home follows Junior layout

When `childExperience` is `teen`, the child home at `/child` SHALL show: header «Главный», profile card, accounts section (product card + piggy + stars), tasks preview, goals preview — in that order. When `childExperience` is `young`, the home SHALL follow the `child-young-home` spec instead. When `childExperience` is `youngDesigner`, the home SHALL follow the `child-young-designer-handoff` spec instead.

#### Scenario: Junior blocks visible

- **WHEN** `childExperience` is `teen` and the user opens `/child`
- **THEN** profile card, accounts, tasks, and goals sections are visible

#### Scenario: Teen home unchanged

- **WHEN** `childExperience` is `teen` and the user opens `/child`
- **THEN** profile card, accounts, tasks, and goals sections appear in the legacy order with the tab bar visible

#### Scenario: Designer home for 8–10

- **WHEN** `childExperience` is `youngDesigner` and the user opens `/child`
- **THEN** the designer handoff child shell is shown instead of the teen or 6–8 young home
