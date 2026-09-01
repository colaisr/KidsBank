## Purpose

Delivers all user-visible strings and demo fixture copy in three synchronized locales: Armenian, Russian, and English.

## ADDED Requirements

### Requirement: Three supported locales

The system SHALL support locales `hy`, `ru`, and `en` from first launch.

#### Scenario: Default locale

- **WHEN** no locale preference is stored
- **THEN** the app initializes with a documented default locale (e.g. `ru`) and all `ui.*` strings render in that language

### Requirement: UI strings use i18n keys only

All chrome labels, buttons, headings, and navigation text SHALL come from `ui.*` keys in locale JSON files under `src/locales/`. Hardcoded user-facing strings in components are forbidden.

#### Scenario: Shell label from catalog

- **WHEN** the role shell renders its title
- **THEN** the text is resolved from a `ui.*` key, not a literal string in source

### Requirement: Demo fixture copy uses demo keys

Demo names, greetings, and other fixture text SHALL use `demo.*` keys in the same locale files. Entity records in `src/data/` SHALL reference ids only, not language-specific text.

#### Scenario: Child name follows locale

- **WHEN** the active locale changes from `ru` to `hy`
- **THEN** the displayed child name on the shell updates to the Armenian `demo.*` value without reload

### Requirement: Locale change updates UI and demo copy together

Changing the active locale SHALL re-render all visible `ui.*` and `demo.*` strings synchronously in a single update.

#### Scenario: Synchronous locale switch

- **WHEN** the user selects English on the appearance screen
- **THEN** shell chrome and demo fixture text both appear in English immediately

### Requirement: Document language attribute updates

The system SHALL set `<html lang="...">` to the active BCP 47 language code (`hy`, `ru`, or `en`).

#### Scenario: Lang attribute on switch

- **WHEN** the user switches locale to `hy`
- **THEN** `document.documentElement.lang` is `hy`
