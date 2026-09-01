## MODIFIED Requirements

### Requirement: Child can accept and complete tasks

The child SHALL advance tasks through `open` → `inProgress` → `waitingParent` via the checkbox on `/child/tasks` or equivalent tap on the home preview. First interaction on `open` accepts; second on `inProgress` marks waiting for parent. Status labels and deadlines SHALL reflect the current state.

#### Scenario: Accept open task

- **WHEN** the child taps the checkbox on a task with status `open`
- **THEN** status becomes `inProgress`

#### Scenario: Mark task done by child

- **WHEN** the child taps the checkbox on a task with status `inProgress`
- **THEN** status becomes `waitingParent`

### Requirement: Parent confirmation pays stars

When the parent confirms a `waitingParent` task, the system SHALL set status to `done`, add `rewardStars` to `starsBalance`, and increment `taskStats.starsEarned` by `rewardStars` and `taskStats.tasksCompleted` by 1.

#### Scenario: Star payout on confirm

- **WHEN** the parent confirms a `waitingParent` task with reward 25
- **THEN** task status is `done`, `starsBalance` increases by 25, `taskStats.starsEarned` increases by 25, and `taskStats.tasksCompleted` increases by 1

## ADDED Requirements

### Requirement: Tasks carry template id and deadline

Each task in demo state SHALL include `templateId` (for i18n title lookup) and `dueTime` as a 24-hour `HH:MM` string shown to the child as «до HH:MM» while the task is active.

#### Scenario: Deadline displayed

- **WHEN** a task has `dueTime` `18:00` and status `open`
- **THEN** the child tasks page shows a localized deadline line containing `18:00`

### Requirement: Lifetime task statistics are tracked

Demo state SHALL include `taskStats` with `starsEarned` (lifetime stars from confirmed tasks) and `tasksCompleted` (count of confirmed tasks). Baseline seed SHALL match the mockup values (860 and 31).

#### Scenario: Stats on tasks page

- **WHEN** the user opens `/child/tasks` after baseline reset
- **THEN** `taskStats.starsEarned` is 860 and `taskStats.tasksCompleted` is 31
