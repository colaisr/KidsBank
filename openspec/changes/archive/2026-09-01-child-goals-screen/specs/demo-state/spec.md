## MODIFIED Requirements

### Requirement: Demo state covers star economy display fields

Demo state SHALL include at minimum: card balance, piggy balance with `shareSlug`, `starsBalance`, `taskStats` (`starsEarned`, `tasksCompleted`), task list with `id`, `templateId`, optional `customTitle` (when `templateId` is `other`), `rewardStars`, `dueTime`, and `statusId`, goals with `id`, `templateId`, optional `customTitle`, `iconId`, `currentStars`, `targetStars`, `amdValue`, `redeemed`, and `selected` (whether the child chose to pursue the goal), optional `cardLimit`, parent wallet balance, and a `transactions` array that MAY include piggy deposit type ids (`piggyCashback`, `piggyGiftMom`, `piggyGiftGrandma`, `parentToPiggy`), `taskReward`, and other transaction types defined in demo baseline.

Parent-created goals and baseline vitrine entries SHALL default to `selected: false`. Baseline reset SHALL seed at least two selected demo goals with partial progress (console and sneakers templates) plus vitrine entries for bicycle, skateboard, book, and headphones with `selected: false` until the child selects them.

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
- **THEN** piggy balance, `shareSlug`, seed piggy deposit transactions, task stats, task list, and goals restore from `DEMO_BASELINE`

#### Scenario: Reset includes transaction seed

- **WHEN** the user resets the demo scenario
- **THEN** piggy balance, `shareSlug`, seed transactions (including demo AMD and ★ rows for today/yesterday), task stats, task list, and goals restore from `DEMO_BASELINE`

#### Scenario: Reset includes goals mock seed

- **WHEN** the user resets the demo scenario
- **THEN** goals include selected in-progress console and sneakers entries and vitrine bicycle, skateboard, book, and headphones with `selected: false`

#### Scenario: Goal fields in state

- **WHEN** the goals page reads demo state
- **THEN** each goal exposes `templateId`, optional `customTitle`, `iconId`, `selected`, star progress, and `amdValue`

#### Scenario: Task fields in state

- **WHEN** the tasks page reads demo state
- **THEN** each task exposes `templateId`, `dueTime`, and `statusId` for rendering

#### Scenario: Task confirm appends star transaction

- **WHEN** the parent confirms a task in waitingParent status
- **THEN** demo state gains a `taskReward` transaction with `currency: STARS`, matching `taskId`, and `amount` equal to `rewardStars`

#### Scenario: Select vitrine goal updates flag

- **WHEN** the child selects a vitrine goal
- **THEN** the existing goal's `selected` field becomes true without creating a duplicate entry

#### Scenario: Deselect returns stars to wallet

- **WHEN** the child deselects a selected goal with accumulated stars
- **THEN** `currentStars` resets to 0 and `starsBalance` increases by the returned amount

### Requirement: Demo state version and pet slice

Demo state version SHALL be 5. The state object SHALL include a `pet` slice with `xp`, `fullness`, `joy`, `energy`, `careCount`, `visitCount`, `taskBuff`, and `lastTickAt`. Missing `pet` in stored state SHALL be backfilled from baseline during normalization. Stored v4 goals without `selected` SHALL migrate: goals with `currentStars > 0` become selected; vitrine baseline entries MAY be appended when missing.

#### Scenario: Migrate v4 to v5

- **WHEN** stored demo state has version 4
- **THEN** goals gain `selected` and missing vitrine baseline goals are merged without resetting balances

#### Scenario: Migrate old localStorage

- **WHEN** stored demo state has no `pet` field
- **THEN** normalization adds baseline pet values without resetting other demo data

#### Scenario: Reset includes pet

- **WHEN** the user resets the demo scenario
- **THEN** `pet` returns to baseline including `taskBuff: false`
