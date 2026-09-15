## ADDED Requirements

### Requirement: Demo state includes children and location slice

Demo state SHALL include a `children` array (minimum one entry with `id`, `nameKey`, and `age`) and an `activeChildId`. It SHALL include location fields: `locationMode` (`live` | `fallback`), `locationUpdatedAt` (ISO string), fallback coordinates for the child marker, saved places with `id`, `labelKey`, and coordinates or offset-from-anchor metadata, and optional `mapLat` / `mapLng` (or equivalent) on `spend` transactions. Schema version SHALL bump when these fields are introduced; reset SHALL restore baseline children and location seed.

#### Scenario: Parent reads active child

- **WHEN** the parent home loads
- **THEN** the profile control shows the child matching `activeChildId`

#### Scenario: Reset restores location seed

- **WHEN** the user resets the demo scenario
- **THEN** children, active child, saved places, spend map coordinates, and `locationUpdatedAt` return to baseline

#### Scenario: Spend with map position

- **WHEN** a `spend` transaction includes map coordinates in demo state
- **THEN** the geolocation screen can render a marker linked to that transaction id
