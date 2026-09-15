# parent-goals Specification

## Purpose

Dedicated parent screen to create and review the child's savings goals in the demo.

## Requirements

### Requirement: Parent goals screen is reachable

The system SHALL expose `/parent/goals` with back to `/parent` and a localized goals title.

#### Scenario: Open from services

- **WHEN** the parent taps the goals service row
- **THEN** the goals screen opens with add-goal CTA and goal list

### Requirement: Parent goals screen lists active goals

The goals screen SHALL list all non-`redeemed` goals with the same read-only row content as the former parent home goals section (title, star progress, AMD redeem value, vitrine hint when not selected).

#### Scenario: Active goals on screen

- **WHEN** the parent opens `/parent/goals` and two active goals exist
- **THEN** both appear in the list

### Requirement: Parent creates goals from goals screen

The goals screen SHALL expose a primary CTA that opens the existing add-goal modal; successful create SHALL append the goal and refresh the list without navigating away.

#### Scenario: Create from goals screen

- **WHEN** the parent taps new goal, completes the form, and confirms
- **THEN** the new goal appears in the list with `selected: false`
