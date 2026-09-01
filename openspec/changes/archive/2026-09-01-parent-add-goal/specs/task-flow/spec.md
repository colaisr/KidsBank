## ADDED Requirements

### Requirement: Goals may be created by parent

Goals in demo state MAY be added by the parent via `parent-goal-management`. Child allocation of `starsBalance` to `goal.currentStars` and redemption to AMD SHALL work the same regardless of who created the goal.

#### Scenario: Child allocates to parent-created goal

- **WHEN** the parent creates a new goal and the child allocates 50 ★ to it
- **THEN** `starsBalance` decreases and `goal.currentStars` increases per existing rules
