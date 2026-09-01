## MODIFIED Requirements

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
