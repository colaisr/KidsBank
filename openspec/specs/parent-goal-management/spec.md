# parent-goal-management Specification

## Purpose

Lets the parent create savings goals for the child from a template catalog or custom title, with icon, star target, and demo AMD redeem value.

## Requirements

### Requirement: Parent can open add-goal flow from home

The parent home SHALL expose a «Цель» quick action that opens an add-goal modal or sheet.

#### Scenario: Open add goal modal

- **WHEN** the parent taps «Цель» on `/parent`
- **THEN** an add-goal form opens with template, icon, target stars, and AMD value fields

### Requirement: Parent selects goal from template or custom text

The add-goal form SHALL let the parent pick from a goal template catalog (`demo.goals.{templateId}.title`) or choose **«Другое»** (`templateId` `other`) and enter `customTitle`. Goal-related templates SHALL NOT overlap with task templates.

#### Scenario: Custom goal title

- **WHEN** the parent selects «Другое», enters «Новый планшет», and confirms
- **THEN** a goal is created with `templateId` `other`, the custom title, `currentStars` 0, and `redeemed` false

### Requirement: Parent selects goal icon

The add-goal form SHALL let the parent choose one of six demo icons (`book`, `paw`, `home`, `utensils`, `gamepad`, `gift`). Template selection MAY prefill a default icon; the parent MAY override before create.

#### Scenario: Icon on create

- **WHEN** the parent selects template `bike`, picks icon `gift`, and confirms
- **THEN** the new goal stores `iconId` `gift` and shows it on `/child/goals`

### Requirement: Parent sets target stars and AMD value

The add-goal form SHALL let the parent choose `targetStars` and `amdValue` from preset chips suitable for demo presentation.

#### Scenario: Create goal with presets

- **WHEN** the parent selects template `bike`, target 800 ★, AMD 120000, and confirms
- **THEN** a new goal is appended with those values and a unique `id`

### Requirement: New goal appears for child immediately

A goal created by the parent SHALL be stored in `kidsbank.demo` with `selected: false` and visible on `/child/goals` in the vitrine section. It SHALL NOT appear on child home until the child selects it.

#### Scenario: Child sees parent-created goal in vitrine

- **WHEN** the parent creates a goal and the role switches to child
- **THEN** the goal appears in the vitrine section on `/child/goals` with 0 progress and a «Select» button

#### Scenario: Child home shows only selected goals

- **WHEN** the parent creates a goal and the child has not selected it
- **THEN** the goal does not appear in the child home goals preview

### Requirement: Parent cannot create duplicate active template goal

The system SHALL prevent adding a second non-`redeemed` goal with the same `templateId` (except `other`). The form SHALL show localized feedback.

#### Scenario: Block duplicate bike goal

- **WHEN** an active `bike` goal exists and the parent tries to add `bike` again
- **THEN** creation is blocked with localized feedback
