# task-flow Specification

## Purpose

Implements the Surf B4 task and star economy loop: accept task, parent confirm, stars to balance, allocate to goal, redeem goal for AMD.

## Requirements

### Requirement: Child can accept and complete tasks

The child SHALL be able to move tasks through statuses: `open` → `inProgress` → `waitingParent`. Tapping an open task accepts it; tapping in-progress marks it waiting for parent.

#### Scenario: Accept open task

- **WHEN** the child taps a task with status `open`
- **THEN** status becomes `inProgress`

#### Scenario: Mark task done by child

- **WHEN** the child taps a task with status `inProgress`
- **THEN** status becomes `waitingParent`

### Requirement: Parent confirmation pays stars

When the parent confirms a `waitingParent` task, the system SHALL set status to `done` and add `rewardStars` to `starsBalance`.

#### Scenario: Star payout on confirm

- **WHEN** the parent confirms a `waitingParent` task with reward 25
- **THEN** task status is `done` and `starsBalance` increases by 25

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
