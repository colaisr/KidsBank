# parent-geolocation Specification

## Purpose

Lets the parent see a map-based view of the child’s current demo location, saved places, and card spend locations for bank and family-safety presentations.

## Requirements

### Requirement: Parent geolocation screen is reachable

The system SHALL expose route `/parent/geolocation` when role is parent. The screen SHALL include a back control to `/parent`, a localized title naming the active child (e.g. «Где {{name}}»), and a presenter info badge with `presenterId` `parent-geolocation`.

#### Scenario: Open geolocation from parent home

- **WHEN** the parent taps the geolocation service row on `/parent`
- **THEN** `/parent/geolocation` opens with map and bottom status sheet

#### Scenario: Return to parent home

- **WHEN** the parent taps back on `/parent/geolocation`
- **THEN** navigation returns to `/parent`

### Requirement: Map shows child, saved places, and spend markers

The geolocation screen SHALL render an interactive map with: one marker for the child’s current position, markers for each saved place in demo data, and markers for each `spend` transaction that has map coordinates in demo state. Non-spend transactions SHALL NOT appear as map markers.

#### Scenario: Spend markers match demo ledger

- **WHEN** demo state includes `spend` rows with map positions
- **THEN** each such row has a corresponding spend marker on the map

#### Scenario: Tap spend marker shows payment detail

- **WHEN** the parent taps a spend marker
- **THEN** a sheet shows localized merchant name, amount in AMD, and transaction time (same content as selecting that row in «Места оплат»)

### Requirement: Live geolocation uses presenter position with neutral copy

When the browser grants geolocation on a secure origin, the child marker SHALL use the presenter’s current coordinates. The map tag and status copy SHALL use neutral «current location» strings (not «at school»). Saved places MAY still include a school entry in the saved-places list.

#### Scenario: GPS allowed

- **WHEN** geolocation succeeds on `/parent/geolocation`
- **THEN** the child marker follows the device position and status text uses neutral location keys

#### Scenario: GPS denied uses fallback seed

- **WHEN** geolocation is denied or unavailable
- **THEN** the child marker and status use fallback coordinates and copy from demo baseline (including school-style labels where seeded)

### Requirement: Saved places and payment places actions

The geolocation screen SHALL provide two actions: «Сохранённые места» opens a sheet listing fixed demo places without add/edit; «Места оплат» opens a sheet listing spend transactions with map positions. Tapping a saved place SHALL pan/highlight that place on the map and close the sheet without changing the child’s current status line.

#### Scenario: Saved place focus

- **WHEN** the parent selects «Дом» (or equivalent) in the saved-places sheet
- **THEN** the map focuses that marker and the child status line remains unchanged

#### Scenario: Payment places list

- **WHEN** the parent opens «Места оплат»
- **THEN** the sheet lists spend transactions that have map coordinates with merchant and amount

### Requirement: Status sheet shows freshness and online state

A bottom sheet on the geolocation screen SHALL show the child avatar initial, a primary status line, a secondary line with place detail and relative «updated N ago» from `locationUpdatedAt`, and a green online indicator for the single demo scenario.

#### Scenario: Relative update time

- **WHEN** the geolocation screen is open and `locationUpdatedAt` is set
- **THEN** the secondary line includes a localized relative time in hy, ru, and en

### Requirement: Map attribution and themes

The map SHALL display required tile provider attribution. Layout and marker styling SHALL use parent adult tokens for both AMIO and Evoca; child card-skin SHALL NOT affect this screen.

#### Scenario: Theme switch on map

- **WHEN** the user switches bank theme on `/parent/geolocation`
- **THEN** marker accents and chrome update via tokens without changing route or marker positions
