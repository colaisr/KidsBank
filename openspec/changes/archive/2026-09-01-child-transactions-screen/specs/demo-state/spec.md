## MODIFIED Requirements

### Requirement: Demo state covers star economy display fields

Demo state SHALL include at minimum: card balance, piggy balance with `shareSlug`, `starsBalance`, `taskStats` (`starsEarned`, `tasksCompleted`), task list with `id`, `templateId`, optional `customTitle` (when `templateId` is `other`), `rewardStars`, `dueTime`, and `statusId`, goals with `id`, `templateId`, optional `customTitle`, `iconId`, `currentStars`, `targetStars`, `amdValue`, and `redeemed`, optional `cardLimit`, parent wallet balance, and a `transactions` array. Each transaction SHALL have `id`, `typeId`, `amount`, `at`, and optional `currency` (`AMD` default, `STARS` for star rewards), optional `taskId` (for `taskReward`), and optional `merchantKey` (for `spend`). Supported `typeId` values SHALL include at minimum: `parentToCard`, `parentToPiggy`, `childToParent`, `spend`, `goalRedeem`, piggy deposit ids (`piggyCashback`, `piggyGiftMom`, `piggyGiftGrandma`, `parentToPiggy`, `cardToPiggy`), `piggyToCard`, and `taskReward`.

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

#### Scenario: Goal fields in state

- **WHEN** the goals page reads demo state
- **THEN** each goal exposes `templateId`, optional `customTitle`, `iconId`, star progress, and `amdValue`

#### Scenario: Task fields in state

- **WHEN** the tasks page reads demo state
- **THEN** each task exposes `templateId`, `dueTime`, and `statusId` for rendering

#### Scenario: Task confirm appends star transaction

- **WHEN** the parent confirms a task in waitingParent status
- **THEN** demo state gains a `taskReward` transaction with `currency: STARS`, matching `taskId`, and `amount` equal to `rewardStars`
