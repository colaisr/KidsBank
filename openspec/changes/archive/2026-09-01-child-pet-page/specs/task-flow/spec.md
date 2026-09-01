## MODIFIED Requirements

### Requirement: Parent confirmation sets pet task buff

When the parent confirms a child task (`waitingParent` → `done`), the system SHALL set `pet.taskBuff` to true in demo state in addition to awarding stars.

#### Scenario: Confirm task enables free pet care

- **WHEN** the parent confirms a task on `/parent`
- **THEN** `pet.taskBuff` is true and the child can perform one free care action on `/child/pet`
