## MODIFIED Requirements

### Requirement: Demo state covers star economy display fields

Demo state SHALL include at minimum: card balance, piggy balance with `shareSlug`, `starsBalance`, `taskStats` (`starsEarned`, `tasksCompleted`), task list with `id`, `templateId`, `rewardStars`, `dueTime`, and `statusId`, goals with `currentStars` and `targetStars`, optional `cardLimit`, parent wallet balance, and a `transactions` array that MAY include piggy deposit type ids (`piggyCashback`, `piggyGiftMom`, `piggyGiftGrandma`, `parentToPiggy`).

#### Scenario: Star fields in state

- **WHEN** the child home reads demo state
- **THEN** star balance, task stats, and goal progress come from the same persisted object

#### Scenario: Money fields in state

- **WHEN** the parent home reads demo state
- **THEN** parent wallet, card limit, and transactions come from the same persisted object

#### Scenario: Piggy share slug in state

- **WHEN** the piggy screen reads demo state
- **THEN** `piggy.shareSlug` is available for building the demo share URL

#### Scenario: Reset includes piggy seed deposits

- **WHEN** the user resets the demo scenario
- **THEN** piggy balance, `shareSlug`, seed piggy deposit transactions, task stats, and task list restore from `DEMO_BASELINE`

#### Scenario: Task fields in state

- **WHEN** the tasks page reads demo state
- **THEN** each task exposes `templateId`, `dueTime`, and `statusId` for rendering
