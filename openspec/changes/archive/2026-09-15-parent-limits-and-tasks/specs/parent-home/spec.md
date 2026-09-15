## MODIFIED Requirements

### Requirement: Parent home shows control dashboard

The parent home SHALL display: child summary, quick action **add goal only**, a **services** section (geolocation, transfer, limits, tasks), active child goals, and spending preview. It SHALL NOT list child tasks inline.

#### Scenario: Tasks not on home

- **WHEN** the parent opens `/parent`
- **THEN** there is no «Задания ребёнка» list block on the home dashboard

### Requirement: Parent home links to tasks with confirmation badge

The services section SHALL include a tasks row navigating to `/parent/tasks`. When one or more tasks are `waitingParent`, the row SHALL show an orange numeric badge equal to that count.

#### Scenario: Badge visible

- **WHEN** two tasks are `waitingParent`
- **THEN** the tasks service row shows badge «2»
