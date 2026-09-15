# parent-home Specification

## Purpose

Provides the parent cabinet home with money control, spending visibility, and pending task confirmations in the active bank theme.

## Requirements

### Requirement: Parent home shows control dashboard

The parent home SHALL display: child summary (card balance, piggy balance), quick action **add goal only**, a **services** section (geolocation, transfer, limits, tasks), an **active child goals** section, and spending history preview. It SHALL NOT list child tasks inline.

#### Scenario: Parent home loads

- **WHEN** the active role is `parent` and the user opens `/parent`
- **THEN** a localized dashboard shows add-goal quick action, services including limits and tasks, and child goals — without a «Задания ребёнка» list block

### Requirement: Parent home uses bank-themed layout variants

The parent home SHALL use one information architecture and **one layout** for both banks. Quick actions SHALL expose **add goal** only in the demo. Switching `data-theme` SHALL change only color tokens (primary, gradients, surfaces, accents), not element order, size, or arrangement.

#### Scenario: AMIO parent layout

- **WHEN** theme is AMIO and role is parent
- **THEN** the add-goal quick action and services section use adult-banking spacing per `17-theme-bank-1`, using AMIO color tokens only

#### Scenario: Evoca parent layout

- **WHEN** theme is Evoca and role is parent
- **THEN** the same layout appears with Evoca color tokens per `17-theme-bank-2`, not a separate feed layout or route set

#### Scenario: Theme switch preserves structure

- **WHEN** the user switches bank theme on `/parent`
- **THEN** section order, quick action, services section, and component sizes remain identical; only colors and gradients update

### Requirement: Parent home scrolls within phone frame

The parent cabinet shell SHALL allow vertical scrolling of all dashboard content when it exceeds the viewport height, consistent with the child cabinet scroll behavior.

#### Scenario: Long dashboard scrolls

- **WHEN** the parent opens `/parent` and content (balance, quick actions, tasks, goals, spending) exceeds the phone viewport
- **THEN** the user can scroll to the bottom spending section without content being clipped

#### Scenario: Header remains reachable

- **WHEN** the user scrolls the parent dashboard
- **THEN** the app header (title, presenter ℹ️, role toggle, appearance) remains visible or returns to the top of the scroll area without breaking layout

### Requirement: Parent home uses adult dashboard visual rhythm

The parent home SHALL present a cohesive adult-banking dashboard: gradient hero with greeting and child balance summary, `bg-surface-muted` content area, consistent section headings, and card-based lists — styled only with theme tokens (`--kb-*` / Tailwind theme aliases).

#### Scenario: Dashboard sections

- **WHEN** the parent views `/parent`
- **THEN** sections appear in order: balance hero, quick actions, **services** (geolocation, transfer, limits, tasks), child goals, spending — with uniform vertical spacing between sections

#### Scenario: No kids styling on parent

- **WHEN** theme or card skin changes
- **THEN** the parent dashboard does not adopt child-only patterns (FAB, kids accent stars on actions, card-skin accents)

### Requirement: Parent home lists active child goals

The parent home SHALL list all non-`redeemed` goals with localized title, progress (`currentStars` / `targetStars`), and demo AMD redeem value.

#### Scenario: Active goals visible

- **WHEN** the parent opens `/parent` and the child has two active goals
- **THEN** both appear in the child goals section

#### Scenario: Redeemed goals hidden

- **WHEN** a goal has `redeemed` true
- **THEN** it does not appear in the parent active goals section

### Requirement: Parent zone shows active child profile

The parent cabinet SHALL show a child profile control (avatar initial, localized name, age subtitle) on `/parent` and nested parent routes. The control SHALL open a sheet listing children from demo state; when only one child exists, the sheet SHALL still list that child as selected. Selecting a child SHALL update the active child id for parent views without requiring a second seeded child.

#### Scenario: Single child sheet

- **WHEN** the parent taps the child profile control and demo lists one child
- **THEN** a sheet shows one row with that child marked selected

### Requirement: Parent home links to geolocation with status

The parent home SHALL include a full-width service row for geolocation in the **services** section after quick actions. The row SHALL navigate to `/parent/geolocation` and SHALL display a short status aligned with the geolocation screen (neutral when live GPS is active, fallback labels otherwise).

#### Scenario: Geolocation row visible

- **WHEN** the parent opens `/parent`
- **THEN** a geolocation row appears in the services section below quick actions

#### Scenario: Status matches geolocation mode

- **WHEN** the parent home renders after visiting geolocation with GPS allowed
- **THEN** the row status uses neutral location copy consistent with the map screen

### Requirement: Parent home links to transfer in services

The parent home SHALL include a full-width service row for transfer in the services section. The row SHALL navigate to `/parent/transfer` and SHALL show a short subtitle indicating card or piggy as targets.

#### Scenario: Transfer row visible

- **WHEN** the parent opens `/parent`
- **THEN** a transfer row appears in the services section below geolocation

#### Scenario: Transfer row navigates

- **WHEN** the parent taps the transfer row
- **THEN** `/parent/transfer` opens

### Requirement: Parent home links to limits in services

The parent home SHALL include a limits service row navigating to `/parent/limits` with subtitle and optional status (e.g. cash daily limit when enabled).

#### Scenario: Limits row navigates

- **WHEN** the parent taps the limits row
- **THEN** `/parent/limits` opens

### Requirement: Parent home links to tasks with confirmation badge

The services section SHALL include a tasks row navigating to `/parent/tasks`. When one or more tasks are `waitingParent`, the row SHALL show an orange numeric badge equal to that count.

#### Scenario: Badge visible

- **WHEN** two tasks are `waitingParent`
- **THEN** the tasks service row shows badge «2»
