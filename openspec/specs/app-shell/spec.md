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

### Requirement: Parent routes support nested screens

The system SHALL nest parent feature routes under `/parent` using a parent shell with an outlet. Index route `/parent` SHALL render the parent home dashboard; `/parent/geolocation`, `/parent/transfer`, `/parent/limits`, `/parent/tasks`, and `/parent/reports` SHALL render their screens — without full page reload.

#### Scenario: Parent geolocation route

- **WHEN** the user navigates to `/parent/geolocation`
- **THEN** the parent shell remains mounted and the geolocation page renders in the outlet

#### Scenario: Parent transfer route

- **WHEN** the user navigates to `/parent/transfer`
- **THEN** the parent shell remains mounted and the transfer page renders in the outlet with sub-screen chrome (no app header / child header on index chrome)

#### Scenario: Parent limits route

- **WHEN** the user navigates to `/parent/limits`
- **THEN** the limits page renders in the outlet with sub-screen chrome

#### Scenario: Parent tasks route

- **WHEN** the user navigates to `/parent/tasks`
- **THEN** the tasks page renders in the outlet with sub-screen chrome

#### Scenario: Parent reports route

- **WHEN** the user navigates to `/parent/reports`
- **THEN** the reports page renders in the outlet with sub-screen chrome

#### Scenario: Unknown parent path

- **WHEN** the user opens an unknown path under `/parent/*`
- **THEN** the app redirects to `/parent`
