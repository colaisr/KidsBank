# parent-task-management Specification

## Purpose
Lets the parent create new tasks for the child from a template catalog with star reward and deadline, stored in demo state without a backend.

## Requirements

### Requirement: Parent can open add-task flow from home

The parent home SHALL expose a «Задание» quick action that opens an add-task modal or sheet.

#### Scenario: Open add task modal

- **WHEN** the parent taps «Задание» on `/parent`
- **THEN** an add-task form opens with template, reward, and deadline fields

### Requirement: Parent selects task from template catalog or custom text

The add-task form SHALL let the parent pick a title from a fixed template catalog of **household chores** (`templateId` with strings in `demo.tasks.*`) or choose **«Другое»** (`templateId` `other`) and enter a custom title stored in `customTitle`. Goal-related actions SHALL NOT appear in the catalog.

#### Scenario: Template list localized

- **WHEN** the add-task form opens with locale `hy`
- **THEN** template labels come from `demo.tasks.{templateId}.title` in Armenian

#### Scenario: Custom task title

- **WHEN** the parent selects «Другое», enters a title, and confirms
- **THEN** a new task is created with `templateId` `other`, the `customTitle` text, and status `open`

### Requirement: Parent sets reward and deadline

The add-task form SHALL let the parent choose `rewardStars` (preset chips, e.g. 10 / 15 / 25) and `dueTime` as HH:MM (time input or preset slots).

#### Scenario: Create task with defaults

- **WHEN** the parent selects template `homework`, reward 25, deadline 18:00, and confirms
- **THEN** a new task is appended with status `open`, the chosen fields, and a unique `id`

### Requirement: New task appears for child immediately

A task created by the parent SHALL be stored in `kidsbank.demo` and visible on `/child/tasks` and the child home preview without reload beyond React state update.

#### Scenario: Child sees parent-created task

- **WHEN** the parent creates a task and the role switches to child
- **THEN** the new task appears in the child's task list as `open`

### Requirement: Parent cannot create duplicate active template

The system SHALL prevent adding a second active (`open`, `inProgress`, or `waitingParent`) task with the same `templateId`. The form SHALL show localized feedback if the template is already active.

#### Scenario: Block duplicate template

- **WHEN** an active task with `templateId` `homework` exists and the parent tries to add `homework` again
- **THEN** creation is blocked with localized feedback

### Requirement: Parent can edit active task reward and deadline

The parent SHALL be able to change `rewardStars` and `dueTime` on tasks with status `open`, `inProgress`, or `waitingParent`. The task `templateId` SHALL NOT be editable after creation.

#### Scenario: Edit open task

- **WHEN** the parent edits reward to 20 and deadline to 19:00 on an `open` task and saves
- **THEN** the task reflects the new values in `kidsbank.demo` and on `/child/tasks`

#### Scenario: Cannot edit done task

- **WHEN** a task has status `done`
- **THEN** edit controls are not offered for that task

### Requirement: Parent can cancel active tasks

The parent SHALL be able to cancel (remove) tasks with status `open`, `inProgress`, or `waitingParent`. Cancellation SHALL remove the task from demo state without star payout.

#### Scenario: Cancel open task

- **WHEN** the parent cancels an `open` task
- **THEN** the task is removed from the child's task list

#### Scenario: Cancel waiting task without stars

- **WHEN** the parent cancels a `waitingParent` task
- **THEN** the task is removed and `starsBalance` and `taskStats` are unchanged
