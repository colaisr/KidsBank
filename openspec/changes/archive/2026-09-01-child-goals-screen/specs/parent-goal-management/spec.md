## MODIFIED Requirements

### Requirement: New goal appears for child immediately

A goal created by the parent SHALL be stored in `kidsbank.demo` with `selected: false` and visible on `/child/goals` in the vitrine section. It SHALL NOT appear on child home until the child selects it.

#### Scenario: Child sees parent-created goal in vitrine

- **WHEN** the parent creates a goal and the role switches to child
- **THEN** the goal appears in the vitrine section on `/child/goals` with 0 progress and a «Select» button

#### Scenario: Child home shows only selected goals

- **WHEN** the parent creates a goal and the child has not selected it
- **THEN** the goal does not appear in the child home goals preview
