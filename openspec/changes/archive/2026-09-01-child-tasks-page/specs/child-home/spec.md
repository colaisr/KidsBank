## MODIFIED Requirements

### Requirement: Tasks support interactive status flow

The child home preview and `/child/tasks` SHALL allow task status transitions per `task-flow` via the task card checkbox (or equivalent tap target). The home preview SHALL show the first two non-done tasks using the compact task card variant (reward badge + deadline + checkbox).

#### Scenario: Accept task from home

- **WHEN** the user taps the checkbox on an `open` task on the child home or tasks page
- **THEN** task status becomes `inProgress`

#### Scenario: Complete task from list

- **WHEN** the user taps the checkbox on an `inProgress` task
- **THEN** task status becomes `waitingParent`

#### Scenario: Home preview uses compact task card

- **WHEN** the child home renders the tasks section
- **THEN** up to two active tasks use the same card visual language as `/child/tasks` (reward badge, deadline, checkbox)
