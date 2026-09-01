## MODIFIED Requirements

### Requirement: Parent home shows control dashboard

The parent home SHALL display: child summary (card balance, piggy balance), quick actions for transfer, add task, and limit, an **active child tasks** section with edit/cancel (and confirm for `waitingParent`), and spending history preview.

#### Scenario: Parent home loads

- **WHEN** the active role is `parent` and the user opens `/parent`
- **THEN** a localized dashboard shows quick actions and the active child tasks section

## ADDED Requirements

### Requirement: Parent home lists active child tasks

The parent home SHALL list all non-`done` tasks with localized title, reward, deadline, status, and actions to edit, cancel, and (for `waitingParent`) confirm per `task-flow`.

#### Scenario: Active tasks visible

- **WHEN** the parent opens `/parent` and the child has three active tasks
- **THEN** all three appear in the child tasks section

#### Scenario: Done tasks hidden

- **WHEN** a task has status `done`
- **THEN** it does not appear in the parent active tasks section
