# child-goals-page Specification

## Purpose

Shows the child's goals tab as a two-section savings experience: selected goals the child is pursuing and a parent-driven vitrine the child can opt into.

## Requirements

### Requirement: Child goals page matches goals tab mockup

The `/child/goals` route SHALL use a gradient header with star affordance left, centered title, presenter ℹ️ and settings link grouped on the right (`HeaderPresenterActions`), and a stars banner showing available balance with localized copy «you have N stars — save for a new goal».

#### Scenario: Header and banner

- **WHEN** the user opens `/child/goals`
- **THEN** the gradient header and stars banner reflect `demo.starsBalance` in the active locale

### Requirement: Goals page splits selected and vitrine sections

The goals page SHALL render two labeled sections: **selected goals** (`selected: true`, `redeemed: false`) and **vitrine** (`selected: false`, `redeemed: false`). Each section SHALL use a two-column card grid.

#### Scenario: Selected section

- **WHEN** goals exist with `selected: true` and `redeemed: false`
- **THEN** they appear under the selected section with progress and in-progress label when below target

#### Scenario: Vitrine section

- **WHEN** goals exist with `selected: false` and `redeemed: false`
- **THEN** they appear under the vitrine section with a localized «Select» button and target stars

#### Scenario: Empty selected section

- **WHEN** no goal is selected
- **THEN** the selected section shows localized empty copy pointing to the vitrine

### Requirement: Child can select a vitrine goal

Tapping «Select» on a vitrine card SHALL set `selected: true` on the existing goal in `demo.goals`. The card SHALL move from vitrine to the selected section without duplicating the goal.

#### Scenario: Select vitrine goal

- **WHEN** the child taps «Select» on a vitrine goal
- **THEN** `selected` becomes true and the goal appears in the selected section and on child home

### Requirement: Child can deselect a selected goal

The goal action sheet for a selected goal SHALL offer «Remove from my goals». Deselecting SHALL set `selected: false`, reset `currentStars` to 0, and return accumulated stars to `starsBalance`.

#### Scenario: Deselect returns stars

- **WHEN** the child deselects a selected goal with 86 ★ on the goal and 860 ★ in wallet
- **THEN** the goal returns to vitrine with 0 progress and wallet shows 946 ★

### Requirement: Active goal actions remain available

Tapping a selected goal card SHALL open a sheet where the child can allocate available ★ to the goal and redeem for AMD when the target is reached, using existing demo actions. Allocation and redeem SHALL only apply to `selected: true` goals.

#### Scenario: Allocate stars

- **WHEN** the child allocates stars from the goal sheet and has sufficient balance
- **THEN** `starsBalance` decreases and `currentStars` increases

#### Scenario: Redeem goal

- **WHEN** the child redeems a completed selected goal from the sheet
- **THEN** AMD is credited to the card, the goal becomes `redeemed`, and a `goalRedeem` transaction is appended
