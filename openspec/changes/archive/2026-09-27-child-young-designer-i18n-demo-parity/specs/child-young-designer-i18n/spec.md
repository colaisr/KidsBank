## Purpose

Localizes the integrated designer child shell (ages 8–10) across hy, ru, and en using the same i18n catalogs as the rest of the prototype.

## ADDED Requirements

### Requirement: Designer child UI uses i18n keys

When `childExperience` is `youngDesigner`, user-visible strings in the integrated designer child shell SHALL come from `ui.designerChild.*` keys in locale files (hy, ru, en), not hardcoded copy in source.

#### Scenario: Language switch on profile updates designer home

- **WHEN** the user sets language to `en` on `/child/profile` and returns to `/child` with age `8-10`
- **THEN** primary navigation and section headings on the designer home appear in English

#### Scenario: Child name from demo catalog

- **WHEN** locale is `hy` and the designer child header shows the child identity
- **THEN** the displayed name matches `demo.david.name` (or active demo child) for that locale

### Requirement: Locale change refreshes bridged demo labels

When locale changes while `youngDesigner` is active, task titles and recipient names shown in the designer shell SHALL reflect the new locale on the next demo sync from `kidsbank.demo`.

#### Scenario: Task title after language change

- **WHEN** the user switches from `ru` to `en` and a homework task is visible
- **THEN** the task title uses the English `demo.tasks.homework.title` string
