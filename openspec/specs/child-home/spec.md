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

The accounts section SHALL show a themed product card with masked number and AMD balance, plus piggy-bank balance in AMD.

#### Scenario: Card and piggy formatted

- **WHEN** locale changes on Appearance
- **THEN** AMD amounts reformat with `Intl` for the active locale

### Requirement: Stars shown on home; tasks and goals use star units

The home SHALL show a star balance counter. Task rewards and goal targets SHALL display in ★, not AMD.

#### Scenario: Star rewards on tasks

- **WHEN** the child home renders tasks
- **THEN** each task shows a star reward pill (e.g. `25 ★`)

#### Scenario: Star target on goal

- **WHEN** the child home renders a goal
- **THEN** the goal shows a progress bar and target in ★

### Requirement: Tasks are display-only in phase 2

Tapping a task SHALL NOT start parent confirmation or change demo state until phase 3.

#### Scenario: Task tap does not confirm

- **WHEN** the user taps a task
- **THEN** no confirmation or payout flow opens

### Requirement: Demo state is persisted and resettable

Scenario values (balances, tasks, goals, stars) SHALL be read from `kidsbank.demo` with baseline in `demoBaseline.ts`. Reset is via Appearance (see `demo-state` spec).

#### Scenario: Reset restores baseline

- **WHEN** the user taps «Сбросить сценарий» on Appearance
- **THEN** card, piggy, stars, tasks, and goals return to `DEMO_BASELINE`

### Requirement: One layout for both themes

Bank differences SHALL be CSS tokens only (`data-theme`).

#### Scenario: Same structure in Evoca

- **WHEN** bank switches to Evoca
- **THEN** the same blocks remain in the same order
