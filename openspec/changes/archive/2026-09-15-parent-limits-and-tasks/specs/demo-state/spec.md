## MODIFIED Requirements

### Requirement: Demo state version 7 includes parent limits fields

Persisted demo state SHALL use version **7** and SHALL include `transferRecipients` and `cashWithdrawal` with migration from v6 via baseline merge.

#### Scenario: Upgrade from v6

- **WHEN** localStorage holds v6 state
- **THEN** load merges default recipients and cash withdrawal from baseline

### Requirement: Tasks may store completion timestamp

Task records SHALL support optional `completedAt` ISO string set when the parent confirms `waitingParent` → `done`.

#### Scenario: Confirm sets timestamp

- **WHEN** the parent confirms a waiting task
- **THEN** the task has `statusId` `done` and `completedAt` set to the confirmation time
