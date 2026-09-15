# parent-home Specification

## Purpose

Provides the parent cabinet home with money control, spending visibility, and pending task confirmations in the active bank theme.

## Requirements

### Requirement: Parent home shows control dashboard

The parent home SHALL display: child summary (card balance, piggy balance), quick actions for transfer, add task, add goal, and limit, an **active child tasks** section with edit/cancel (and confirm for `waitingParent`), an **active child goals** section, and spending history preview.

#### Scenario: Parent home loads

- **WHEN** the active role is `parent` and the user opens `/parent`
- **THEN** a localized dashboard shows quick actions including «Цель», the active child tasks section, and the active child goals section

### Requirement: Parent home uses bank-themed layout variants

The parent home SHALL use one information architecture and **one layout** for both banks. Quick actions SHALL appear in a **2×2 grid** on all themes. Switching `data-theme` SHALL change only color tokens (primary, gradients, surfaces, accents), not element order, size, or arrangement.

#### Scenario: AMIO parent layout

- **WHEN** theme is AMIO and role is parent
- **THEN** quick actions appear in a 2×2 grid with adult-banking spacing per `17-theme-bank-1`, using AMIO color tokens only

#### Scenario: Evoca parent layout

- **WHEN** theme is Evoca and role is parent
- **THEN** the same 2×2 quick-action grid appears with Evoca color tokens per `17-theme-bank-2`, not a separate feed layout or route set

#### Scenario: Theme switch preserves structure

- **WHEN** the user switches bank theme on `/parent`
- **THEN** section order, quick-action grid, and component sizes remain identical; only colors and gradients update

### Requirement: Parent home scrolls within phone frame

The parent cabinet shell SHALL allow vertical scrolling of all dashboard content when it exceeds the viewport height, consistent with the child cabinet scroll behavior.

#### Scenario: Long dashboard scrolls

- **WHEN** the parent opens `/parent` and content (balance, quick actions, tasks, goals, spending) exceeds the phone viewport
- **THEN** the user can scroll to the bottom spending section without content being clipped

#### Scenario: Header remains reachable

- **WHEN** the user scrolls the parent dashboard
- **THEN** the app header (title, presenter ℹ️, role toggle, appearance) remains visible or returns to the top of the scroll area without breaking layout

### Requirement: Parent home uses adult dashboard visual rhythm

The parent home SHALL present a cohesive adult-banking dashboard: gradient hero with greeting and child balance summary, `bg-surface-muted` content area, consistent section headings, and card-based lists — styled only with theme tokens (`--kb-*` / Tailwind theme aliases).

#### Scenario: Dashboard sections

- **WHEN** the parent views `/parent`
- **THEN** sections appear in order: balance hero, quick actions, geolocation service entry, child tasks, child goals, spending — with uniform vertical spacing between sections

#### Scenario: No kids styling on parent

- **WHEN** theme or card skin changes
- **THEN** the parent dashboard does not adopt child-only patterns (FAB, kids accent stars on actions, card-skin accents)

### Requirement: Parent limit action shows active limit

When a spending limit is set, the limit quick-action control SHALL display the active limit amount. When no limit is set, it SHALL show a not-set state. The top balance summary SHALL NOT duplicate limit status.

#### Scenario: Limit visible on limit action

- **WHEN** `cardLimit` is set and the parent views quick actions
- **THEN** the limit action shows the active limit amount

### Requirement: Parent can confirm pending tasks from home

The parent home SHALL list tasks in `waitingParent` status with a confirm action that triggers star payout per `task-flow`.

#### Scenario: Confirm task from parent home

- **WHEN** a task is `waitingParent` and the parent taps confirm
- **THEN** the task moves to `done` and the child's `starsBalance` increases by `rewardStars`

### Requirement: Parent home lists active child tasks

The parent home SHALL list all non-`done` tasks with localized title, reward, deadline, status, and actions to edit, cancel, and (for `waitingParent`) confirm per `task-flow`.

#### Scenario: Active tasks visible

- **WHEN** the parent opens `/parent` and the child has three active tasks
- **THEN** all three appear in the child tasks section

#### Scenario: Done tasks hidden

- **WHEN** a task has status `done`
- **THEN** it does not appear in the parent active tasks section

### Requirement: Parent home lists active child goals

The parent home SHALL list all non-`redeemed` goals with localized title, progress (`currentStars` / `targetStars`), and demo AMD redeem value.

#### Scenario: Active goals visible

- **WHEN** the parent opens `/parent` and the child has two active goals
- **THEN** both appear in the child goals section

#### Scenario: Redeemed goals hidden

- **WHEN** a goal has `redeemed` true
- **THEN** it does not appear in the parent active goals section

### Requirement: Parent zone shows active child profile

The parent cabinet SHALL show a child profile control (avatar initial, localized name, age subtitle) on `/parent` and nested parent routes. The control SHALL open a sheet listing children from demo state; when only one child exists, the sheet SHALL still list that child as selected. Selecting a child SHALL update the active child id for parent views without requiring a second seeded child.

#### Scenario: Single child sheet

- **WHEN** the parent taps the child profile control and demo lists one child
- **THEN** a sheet shows one row with that child marked selected

### Requirement: Parent home links to geolocation with status

The parent home SHALL include a full-width service row for geolocation immediately after the quick-actions section. The row SHALL navigate to `/parent/geolocation` and SHALL display a short status aligned with the geolocation screen (neutral when live GPS is active, fallback labels otherwise).

#### Scenario: Geolocation row visible

- **WHEN** the parent opens `/parent`
- **THEN** a geolocation row appears below the 2×2 quick actions and above child tasks

#### Scenario: Status matches geolocation mode

- **WHEN** the parent home renders after visiting geolocation with GPS allowed
- **THEN** the row status uses neutral location copy consistent with the map screen
