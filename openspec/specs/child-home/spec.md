# child-home Specification

## Purpose

Shows the child home per AMIO Junior mockup: accounts, stars, tasks, and goals as a living demo shell.

## Requirements

### Requirement: Child home follows Junior layout

The child home SHALL show: header «Главный», profile card, accounts section (product card + piggy + stars), tasks preview, goals preview — in that order.

#### Scenario: Junior blocks visible

- **WHEN** the user opens `/child`
- **THEN** profile card, accounts, tasks, and goals sections are visible

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

### Requirement: Tasks support interactive status flow

The child home and tasks list SHALL allow task status transitions per `task-flow`. Tapping a task SHALL accept or mark complete when status permits.

#### Scenario: Accept task from home

- **WHEN** the user taps an `open` task on the child home or tasks page
- **THEN** task status becomes `inProgress`

#### Scenario: Complete task from list

- **WHEN** the user taps an `inProgress` task
- **THEN** task status becomes `waitingParent`

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
