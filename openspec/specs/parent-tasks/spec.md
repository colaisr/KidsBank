# parent-tasks Specification

## Purpose

Provides the parent-facing tasks hub: create chores, review pending work, and confirm child completions with star payout.

## Requirements

### Requirement: Parent tasks screen is reachable

The system SHALL expose `/parent/tasks` with back to `/parent`, localized title «Задания», and a primary CTA to create a new task.

#### Scenario: New task CTA

- **WHEN** the parent taps «+ Новое задание»
- **THEN** the add-task flow opens (modal) and new tasks appear in the pending section

### Requirement: Parent tasks list uses pending and completed-today sections

The screen SHALL list non-done tasks under **Ожидают** and tasks confirmed today under **Выполнено сегодня** using `completedAt` local date.

#### Scenario: Pending row

- **WHEN** a task is `open` or `waitingParent`
- **THEN** it appears in the pending section with deadline and star reward meta

#### Scenario: Completed today row

- **WHEN** a task is `done` with `completedAt` on the current local day
- **THEN** it appears struck-through in the completed-today section with confirmed copy

### Requirement: Parent confirms waiting tasks from tasks screen

Tapping a `waitingParent` task SHALL open a sheet with confirm, edit, and cancel actions per `parent-task-management`.

#### Scenario: Confirm from sheet

- **WHEN** the parent confirms from the sheet
- **THEN** the task becomes `done`, stars credit, and the service-row badge count decreases
