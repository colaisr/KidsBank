## ADDED Requirements

### Requirement: Cancelled tasks do not pay stars

Removing a task before it reaches `done` SHALL NOT change `starsBalance` or `taskStats`. Only parent confirmation of `waitingParent` triggers payout per existing rules.

#### Scenario: No payout on cancel

- **WHEN** the parent cancels a `waitingParent` task that had reward 25
- **THEN** `starsBalance` and `taskStats.starsEarned` remain unchanged
