# app-shell Specification

## Purpose
Provides the runnable mobile-web application scaffold: build tooling, phone-frame layout, routing shell, and typography that supports hy, ru, and en.

## Requirements

### Requirement: Application boots as a mobile-first web app

The system SHALL serve a single-page application optimized for a narrow phone viewport (~360–430px width). On wider screens, content SHALL remain in a centered phone frame rather than expanding to a desktop layout.

#### Scenario: Phone viewport layout

- **WHEN** the user opens the app on a viewport ≤ 430px wide
- **THEN** the main content fills the viewport width with mobile-appropriate padding

#### Scenario: Desktop viewport frame

- **WHEN** the user opens the app on a viewport wider than 430px
- **THEN** the app displays inside a centered phone frame with a neutral outer background

### Requirement: Development and production builds work

The system SHALL provide scripts to run a development server and produce a static production build without a backend.

#### Scenario: Local development

- **WHEN** a developer runs the dev script
- **THEN** the app loads in the browser with hot reload

#### Scenario: Static build

- **WHEN** a developer runs the build script
- **THEN** static assets are emitted suitable for static hosting

### Requirement: Typography covers three scripts

The system SHALL load fonts that render Latin, Cyrillic, and Armenian text legibly for all UI and demo copy.

#### Scenario: Armenian text renders

- **WHEN** the active locale is `hy`
- **THEN** Armenian characters in UI and demo strings render without fallback boxes

### Requirement: Base routing exists for shell screens

The system SHALL support client-side navigation between the role shell home, the appearance screen, and future routes without full page reload.

#### Scenario: In-app navigation

- **WHEN** the user navigates from the role shell to appearance and back
- **THEN** the transition occurs without a full browser reload
