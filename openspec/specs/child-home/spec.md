# child-home Specification

## Purpose

Shows the child home per AMIO Junior mockup: accounts, stars, tasks, and goals as a living demo shell.

## Requirements

### Requirement: Child home follows Junior layout

When `childExperience` is `teen`, the child home at `/child` SHALL show: header «Главный», profile card, accounts section (product card + piggy + stars), tasks preview, goals preview — in that order. When `childExperience` is `young`, the home SHALL follow the `child-young-home` spec instead. When `childExperience` is `youngDesigner`, the home SHALL follow the `child-young-designer-handoff` spec instead.

#### Scenario: Junior blocks visible

- **WHEN** `childExperience` is `teen` and the user opens `/child`
- **THEN** profile card, accounts, tasks, and goals sections are visible

#### Scenario: Teen home unchanged

- **WHEN** `childExperience` is `teen` and the user opens `/child`
- **THEN** profile card, accounts, tasks, and goals sections appear in the legacy order with the tab bar visible

#### Scenario: Designer home for 8–10

- **WHEN** `childExperience` is `youngDesigner` and the user opens `/child`
- **THEN** the designer handoff child shell is shown instead of the teen or 6–8 young home

### Requirement: Child home shows account card and piggy in AMD

The accounts section SHALL show a themed product card with masked number and AMD balance that links to `/child/card-design`, plus a piggy-bank tile with AMD balance that links to `/child/piggy`.

#### Scenario: Card and piggy formatted

- **WHEN** locale changes on Appearance
- **THEN** AMD amounts reformat with `Intl` for the active locale

#### Scenario: Piggy links to piggy screen

- **WHEN** the user taps the piggy tile on the child home
- **THEN** `/child/piggy` opens

#### Scenario: Card links to card design

- **WHEN** the user taps the product card on the child home
- **THEN** `/child/card-design` opens

### Requirement: Stars shown on home; tasks and goals use star units

The home SHALL show a star balance counter. Task rewards and goal targets SHALL display in ★, not AMD. The goals preview SHALL list all selected non-redeemed goals (not a single goal). Stars card and header star icon SHALL link to `/child/goals`.

#### Scenario: Star rewards on tasks

- **WHEN** the child home renders tasks
- **THEN** each task shows a star reward pill (e.g. `25 ★`)

#### Scenario: Star target on goal

- **WHEN** the child home renders a selected goal
- **THEN** the goal shows a progress bar and target in ★

#### Scenario: Multiple selected goals on home

- **WHEN** two or more goals have `selected: true` and `redeemed: false`
- **THEN** all selected goals appear in the home goals preview

#### Scenario: Vitrine goal hidden on home

- **WHEN** a goal has `selected: false`
- **THEN** it does not appear in the home goals preview

#### Scenario: Allocate stars to goal

- **WHEN** the user allocates stars to a selected goal from the goals page
- **THEN** `starsBalance` and `goal.currentStars` update per `task-flow`

#### Scenario: Stars link to goals

- **WHEN** the user taps the stars card or header star icon on home
- **THEN** `/child/goals` opens

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

### Requirement: Demo state is persisted and resettable

Scenario values (balances, tasks, goals, stars, transactions, limits) SHALL be read from `kidsbank.demo` v2 with baseline in `demoBaseline.ts`. Reset is via profile settings or Appearance (see `demo-state` spec).

#### Scenario: Reset restores baseline

- **WHEN** the user taps «Сбросить сценарий» in settings
- **THEN** demo state returns to `DEMO_BASELINE` with a visible confirmation

### Requirement: One layout for both themes

Bank differences SHALL be CSS tokens only (`data-theme`).

#### Scenario: Same structure in Evoca

- **WHEN** bank switches to Evoca
- **THEN** the same blocks remain in the same order
