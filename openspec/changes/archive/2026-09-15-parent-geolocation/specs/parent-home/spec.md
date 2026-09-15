## MODIFIED Requirements

### Requirement: Parent home uses adult dashboard visual rhythm

The parent home SHALL present a cohesive adult-banking dashboard: gradient hero with greeting and child balance summary, `bg-surface-muted` content area, consistent section headings, and card-based lists — styled only with theme tokens (`--kb-*` / Tailwind theme aliases).

#### Scenario: Dashboard sections

- **WHEN** the parent views `/parent`
- **THEN** sections appear in order: balance hero, quick actions, geolocation service entry, child tasks, child goals, spending — with uniform vertical spacing between sections

#### Scenario: No kids styling on parent

- **WHEN** theme or card skin changes
- **THEN** the parent dashboard does not adopt child-only patterns (FAB, kids accent stars on actions, card-skin accents)

## ADDED Requirements

### Requirement: Parent zone shows active child profile

The parent cabinet SHALL show a child profile control (avatar initial, localized name, age subtitle) on `/parent` and nested parent routes. The control SHALL open a sheet listing children from demo state; when only one child exists, the sheet SHALL still list that child as selected. Selecting a child SHALL update the active child id for parent views without requiring a second seeded child.

#### Scenario: Single child sheet

- **WHEN** the parent taps the child profile control and demo lists one child
- **THEN** a sheet shows one row with that child marked selected

### Requirement: Parent home links to geolocation with status

The parent home SHALL include a full-width service row for geolocation immediately after the quick-actions section. The row SHALL navigate to `/parent/geolocation` and SHALL display a short status aligned with the geolocation screen (neutral when live GPS is active, fallback labels otherwise).

#### Scenario: Geolocation row visible

- **WHEN** the parent opens `/parent`
- **THEN** a geolocation row appears below the 2×2 quick actions and above child tasks

#### Scenario: Status matches geolocation mode

- **WHEN** the parent home renders after visiting geolocation with GPS allowed
- **THEN** the row status uses neutral location copy consistent with the map screen
