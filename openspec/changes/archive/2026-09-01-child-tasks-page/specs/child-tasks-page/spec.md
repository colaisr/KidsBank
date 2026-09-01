## Purpose

Full-screen child tasks list per AMIO Junior mockup: lifetime stats, task cards with star rewards and deadlines, and checkbox-driven status flow.

## ADDED Requirements

### Requirement: Child tasks page shows lifetime statistics

The `/child/tasks` screen SHALL display two summary cards above the task list: total stars earned (`taskStats.starsEarned`) with a star icon, and total tasks completed (`taskStats.tasksCompleted`) with a check icon. Labels SHALL be localized.

#### Scenario: Stats from demo state

- **WHEN** the user opens `/child/tasks`
- **THEN** the earned-stars card shows `taskStats.starsEarned` and the completed card shows `taskStats.tasksCompleted`

### Requirement: Child tasks page shows task cards per mockup

Each active task card SHALL show: an orange star-reward badge (e.g. `25 ★`), localized title from `demo.tasks.{templateId}.title`, a deadline line formatted as «до HH:MM» from `dueTime`, and a large rounded checkbox control on the right. Completed tasks (`done`) SHALL show strikethrough title, a localized «done» label instead of deadline, and a filled green checkbox.

#### Scenario: Active task layout

- **WHEN** a task has status `open` or `inProgress`
- **THEN** the card shows reward badge, title, deadline, and an empty checkbox

#### Scenario: Completed task layout

- **WHEN** a task has status `done`
- **THEN** the title is struck through, the deadline is replaced by a done label, and the checkbox is green and checked

#### Scenario: Waiting parent state

- **WHEN** a task has status `waitingParent`
- **THEN** the card shows a localized waiting label instead of deadline and the checkbox is disabled or shows a pending visual state

### Requirement: Child tasks page supports checkbox status flow

Tapping the checkbox on an active task SHALL advance status per `task-flow`: `open` → `inProgress` on first tap, `inProgress` → `waitingParent` on second tap. Tapping SHALL NOT change `waitingParent` or `done` tasks.

#### Scenario: Accept via checkbox

- **WHEN** the child taps the checkbox on an `open` task
- **THEN** status becomes `inProgress`

#### Scenario: Complete via checkbox

- **WHEN** the child taps the checkbox on an `inProgress` task
- **THEN** status becomes `waitingParent`

### Requirement: Child tasks page uses standard child chrome

The tasks page SHALL use `ChildPageTitle` with localized title «Задания», back navigation to `/child`, and presenter settings link per `child-nav`.

#### Scenario: Back to home

- **WHEN** the user taps back on the tasks page
- **THEN** `/child` opens

### Requirement: Tasks are ordered active before completed

The task list SHALL sort tasks so non-`done` items appear first (preserving baseline order within each group), then `done` items at the bottom.

#### Scenario: Completed task at bottom

- **WHEN** the tasks page renders the baseline seed
- **THEN** the `done` task appears after all active tasks
