## ADDED Requirements

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
