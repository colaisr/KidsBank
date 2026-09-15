## MODIFIED Requirements

### Requirement: Parent home shows control dashboard

The parent home SHALL display: child summary (card balance, piggy balance), quick actions for **add task, add goal, and limit** (transfer is not a quick action), a **services** section with geolocation and transfer entries, an **active child tasks** section with edit/cancel (and confirm for `waitingParent`), an **active child goals** section, and spending history preview.

#### Scenario: Parent home loads

- **WHEN** the active role is `parent` and the user opens `/parent`
- **THEN** a localized dashboard shows quick actions without a transfer tile, a services section including transfer, the active child tasks section, and the active child goals section

### Requirement: Parent home uses bank-themed layout variants

The parent home SHALL use one information architecture and **one layout** for both banks. Quick actions SHALL appear in a **grid** (three actions in the demo: task, goal, limit) on all themes. Switching `data-theme` SHALL change only color tokens (primary, gradients, surfaces, accents), not element order, size, or arrangement.

#### Scenario: AMIO parent layout

- **WHEN** theme is AMIO and role is parent
- **THEN** quick actions appear in the task/goal/limit grid with adult-banking spacing per `17-theme-bank-1`, using AMIO color tokens only

#### Scenario: Evoca parent layout

- **WHEN** theme is Evoca and role is parent
- **THEN** the same quick-action grid appears with Evoca color tokens per `17-theme-bank-2`, not a separate feed layout or route set

#### Scenario: Theme switch preserves structure

- **WHEN** the user switches bank theme on `/parent`
- **THEN** section order, quick-action grid, services section, and component sizes remain identical; only colors and gradients update

### Requirement: Parent home uses adult dashboard visual rhythm

The parent home SHALL present a cohesive adult-banking dashboard: gradient hero with greeting and child balance summary, `bg-surface-muted` content area, consistent section headings, and card-based lists — styled only with theme tokens (`--kb-*` / Tailwind theme aliases).

#### Scenario: Dashboard sections

- **WHEN** the parent views `/parent`
- **THEN** sections appear in order: balance hero, quick actions, **services** (geolocation and transfer rows), child tasks, child goals, spending — with uniform vertical spacing between sections

#### Scenario: No kids styling on parent

- **WHEN** theme or card skin changes
- **THEN** the parent dashboard does not adopt child-only patterns (FAB, kids accent stars on actions, card-skin accents)

## ADDED Requirements

### Requirement: Parent home links to transfer in services

The parent home SHALL include a full-width service row for transfer in the services section. The row SHALL navigate to `/parent/transfer` and SHALL show a short subtitle indicating card or piggy as targets.

#### Scenario: Transfer row visible

- **WHEN** the parent opens `/parent`
- **THEN** a transfer row appears in the services section below geolocation

#### Scenario: Transfer row navigates

- **WHEN** the parent taps the transfer row
- **THEN** `/parent/transfer` opens
