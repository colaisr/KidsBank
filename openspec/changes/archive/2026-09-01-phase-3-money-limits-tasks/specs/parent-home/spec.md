## Purpose

Provides the parent cabinet home with money control, spending visibility, and pending task confirmations in the active bank theme.

## ADDED Requirements

### Requirement: Parent home shows control dashboard

The parent home SHALL display: child summary (name, card balance), quick actions for transfer and limit, spending history preview, and pending task confirmations queue.

#### Scenario: Parent home loads

- **WHEN** the active role is `parent` and the user opens `/parent`
- **THEN** a localized dashboard is shown instead of the phase-2 empty placeholder

### Requirement: Parent home uses bank-themed layout variants

The parent home SHALL use one information architecture for both banks. AMIO SHALL present quick actions as a grid; Evoca SHALL present them as a vertical feed of cards. Both SHALL expose the same actions and data.

#### Scenario: AMIO parent layout

- **WHEN** theme is AMIO and role is parent
- **THEN** quick actions appear in a grid with adult-banking spacing per `17-theme-bank-1`

#### Scenario: Evoca parent layout

- **WHEN** theme is Evoca and role is parent
- **THEN** the same actions appear as feed cards per `17-theme-bank-2`, not a separate route set

### Requirement: Parent can confirm pending tasks from home

The parent home SHALL list tasks in `waitingParent` status with a confirm action that triggers star payout per `task-flow`.

#### Scenario: Confirm task from parent home

- **WHEN** a task is `waitingParent` and the parent taps confirm
- **THEN** the task moves to `done` and the child's `starsBalance` increases by `rewardStars`
