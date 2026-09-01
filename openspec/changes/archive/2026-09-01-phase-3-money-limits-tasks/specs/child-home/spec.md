## REMOVED Requirements

### Requirement: Tasks are display-only in phase 2

**Reason**: Phase 3 implements the full task flow per Surf B4.
**Migration**: Tasks accept taps that change status per `task-flow` spec.

## ADDED Requirements

### Requirement: Tasks support interactive status flow

The child home and tasks list SHALL allow task status transitions per `task-flow`. Tapping a task SHALL accept or mark complete when status permits.

#### Scenario: Accept task from home

- **WHEN** the user taps an `open` task on the child home or tasks page
- **THEN** task status becomes `inProgress`

#### Scenario: Complete task from list

- **WHEN** the user taps an `inProgress` task
- **THEN** task status becomes `waitingParent`

## MODIFIED Requirements

### Requirement: Stars shown on home; tasks and goals use star units

The home SHALL show a star balance counter. Task rewards and goal targets SHALL display in ★, not AMD. Goals SHALL offer star allocation when the user has available balance. Stars card and header star icon SHALL link to `/child/goals`.

#### Scenario: Star rewards on tasks

- **WHEN** the child home renders tasks
- **THEN** each task shows a star reward pill (e.g. `25 ★`)

#### Scenario: Star target on goal

- **WHEN** the child home renders a goal
- **THEN** the goal shows a progress bar and target in ★

#### Scenario: Allocate stars to goal

- **WHEN** the user allocates stars to a goal from the goals page
- **THEN** `starsBalance` and `goal.currentStars` update per `task-flow`

#### Scenario: Stars link to goals

- **WHEN** the user taps the stars card or header star icon on home
- **THEN** `/child/goals` opens
