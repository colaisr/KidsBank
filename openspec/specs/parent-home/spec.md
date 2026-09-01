# parent-home Specification

## Purpose

Provides the parent cabinet home with money control, spending visibility, and pending task confirmations in the active bank theme.

## Requirements

### Requirement: Parent home shows control dashboard

The parent home SHALL display: child summary (card balance, piggy balance), quick actions for transfer, add task, and limit, an **active child tasks** section with edit/cancel (and confirm for `waitingParent`), and spending history preview.

#### Scenario: Parent home loads

- **WHEN** the active role is `parent` and the user opens `/parent`
- **THEN** a localized dashboard shows quick actions and the active child tasks section

### Requirement: Parent home uses bank-themed layout variants

The parent home SHALL use one information architecture for both banks. AMIO SHALL present quick actions as a grid; Evoca SHALL present them as a vertical feed of cards. Both SHALL expose the same actions and data.

#### Scenario: AMIO parent layout

- **WHEN** theme is AMIO and role is parent
- **THEN** quick actions appear in a grid with adult-banking spacing per `17-theme-bank-1`

#### Scenario: Evoca parent layout

- **WHEN** theme is Evoca and role is parent
- **THEN** the same actions appear as feed cards per `17-theme-bank-2`, not a separate route set

### Requirement: Parent limit action shows active limit

When a spending limit is set, the limit quick-action control SHALL display the active limit amount. When no limit is set, it SHALL show a not-set state. The top balance summary SHALL NOT duplicate limit status.

#### Scenario: Limit visible on limit action

- **WHEN** `cardLimit` is set and the parent views quick actions
- **THEN** the limit action shows the active limit amount

### Requirement: Parent can confirm pending tasks from home

The parent home SHALL list tasks in `waitingParent` status with a confirm action that triggers star payout per `task-flow`.

#### Scenario: Confirm task from parent home

- **WHEN** a task is `waitingParent` and the parent taps confirm
- **THEN** the task moves to `done` and the child's `starsBalance` increases by `rewardStars`

### Requirement: Parent home lists active child tasks

The parent home SHALL list all non-`done` tasks with localized title, reward, deadline, status, and actions to edit, cancel, and (for `waitingParent`) confirm per `task-flow`.

#### Scenario: Active tasks visible

- **WHEN** the parent opens `/parent` and the child has three active tasks
- **THEN** all three appear in the child tasks section

#### Scenario: Done tasks hidden

- **WHEN** a task has status `done`
- **THEN** it does not appear in the parent active tasks section
