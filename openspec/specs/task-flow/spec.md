# task-flow Specification

## Purpose

Implements the Surf B4 task and star economy loop: accept task, parent confirm, stars to balance, allocate to goal, redeem goal for AMD.

## Requirements

### Requirement: Child can mark tasks done for parent review

The child SHALL mark an active task (`open` or `inProgress`) as `waitingParent` with a **single** checkbox tap on `/child/tasks` or the home preview. A brief star-burst celebration animation SHALL play on submit unless `prefers-reduced-motion` is set.

#### Scenario: Single tap marks waiting

- **WHEN** the child taps the checkbox on a task with status `open`
- **THEN** status becomes `waitingParent` immediately

#### Scenario: Celebration on submit

- **WHEN** the child taps the checkbox on an active task
- **THEN** a localized star animation plays at the checkbox before the card shows the waiting state

### Requirement: Parent confirmation pays stars

When the parent confirms a `waitingParent` task, the system SHALL set status to `done`, add `rewardStars` to `starsBalance`, and increment `taskStats.starsEarned` by `rewardStars` and `taskStats.tasksCompleted` by 1.

#### Scenario: Star payout on confirm

- **WHEN** the parent confirms a `waitingParent` task with reward 25
- **THEN** task status is `done`, `starsBalance` increases by 25, `taskStats.starsEarned` increases by 25, `taskStats.tasksCompleted` increases by 1, and `pet.taskBuff` is set to true

### Requirement: Parent confirmation sets pet task buff

When the parent confirms a child task (`waitingParent` → `done`), the system SHALL set `pet.taskBuff` to true in demo state in addition to awarding stars.

#### Scenario: Confirm task enables free pet care

- **WHEN** the parent confirms a task on `/parent`
- **THEN** `pet.taskBuff` is true and the child can perform one free care action on `/child/pet`

### Requirement: Child can allocate stars to a goal

The child SHALL be able to move stars from `starsBalance` to a goal's `currentStars` in steps (demo default +50 ★) up to `targetStars` and available balance.

#### Scenario: Add stars to goal

- **WHEN** the child allocates 50 ★ to a goal with room on target
- **THEN** `starsBalance` decreases by 50 and `goal.currentStars` increases by 50

### Requirement: Goals page shows available star balance

The child goals page SHALL display the current `starsBalance` available for allocation above the goal list.

#### Scenario: Wallet visible on goals

- **WHEN** the user opens `/child/goals`
- **THEN** available stars balance is shown prominently

### Requirement: Completed goal redeems to card AMD

When `currentStars` reaches `targetStars`, the child MAY redeem the goal. Redemption SHALL move a demo AMD amount to the child's card balance and mark the goal redeemed in demo state.

#### Scenario: Redeem completed goal

- **WHEN** a goal has `currentStars >= targetStars` and the child redeems
- **THEN** card balance increases by the goal's demo AMD value and the goal is marked redeemed

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

### Requirement: Cancelled tasks do not pay stars

Removing a task before it reaches `done` SHALL NOT change `starsBalance` or `taskStats`. Only parent confirmation of `waitingParent` triggers payout per existing rules.

#### Scenario: No payout on cancel

- **WHEN** the parent cancels a `waitingParent` task that had reward 25
- **THEN** `starsBalance` and `taskStats.starsEarned` remain unchanged

### Requirement: Goals may be created by parent

Goals in demo state MAY be added by the parent via `parent-goal-management`. Child allocation of `starsBalance` to `goal.currentStars` and redemption to AMD SHALL work the same regardless of who created the goal.

#### Scenario: Child allocates to parent-created goal

- **WHEN** the parent creates a new goal and the child allocates 50 ★ to it
- **THEN** `starsBalance` decreases and `goal.currentStars` increases per existing rules
