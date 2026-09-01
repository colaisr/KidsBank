## MODIFIED Requirements

### Requirement: Demo state version and pet slice

Demo state version SHALL be 4. The state object SHALL include a `pet` slice with `xp`, `fullness`, `joy`, `energy`, `careCount`, `visitCount`, `taskBuff`, and `lastTickAt`. Missing `pet` in stored state SHALL be backfilled from baseline during normalization.

#### Scenario: Migrate old localStorage

- **WHEN** stored demo state has no `pet` field
- **THEN** normalization adds baseline pet values without resetting other demo data

#### Scenario: Reset includes pet

- **WHEN** the user resets the demo scenario
- **THEN** `pet` returns to baseline including `taskBuff: false`
