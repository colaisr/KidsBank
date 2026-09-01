## MODIFIED Requirements

### Requirement: Parent home shows control dashboard

The parent home SHALL display: child summary, quick actions for transfer, add task, add goal, and limit, active child tasks section, active child goals section, and spending history preview.

#### Scenario: Parent home loads

- **WHEN** the active role is `parent` and the user opens `/parent`
- **THEN** a localized dashboard shows quick actions including «Цель» and the child goals section

## ADDED Requirements

### Requirement: Parent home lists active child goals

The parent home SHALL list all non-`redeemed` goals with localized title, progress (`currentStars` / `targetStars`), and demo AMD redeem value.

#### Scenario: Active goals visible

- **WHEN** the parent opens `/parent` and the child has two active goals
- **THEN** both appear in the child goals section

#### Scenario: Redeemed goals hidden

- **WHEN** a goal has `redeemed` true
- **THEN** it does not appear in the parent active goals section
