## MODIFIED Requirements

### Requirement: Parent can open add-goal flow from home

The parent SHALL open the add-goal modal from **`/parent/goals`** via a new-goal CTA. The parent home SHALL NOT expose a standalone «Цель» quick action.

#### Scenario: Open add goal modal

- **WHEN** the parent taps new goal on `/parent/goals`
- **THEN** an add-goal form opens with template, icon, target stars, and AMD value fields

#### Scenario: Goals service row

- **WHEN** the parent taps the goals row on `/parent`
- **THEN** `/parent/goals` opens
