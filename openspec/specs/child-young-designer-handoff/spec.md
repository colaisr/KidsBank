# child-young-designer-handoff Specification

## Purpose
Integrates the designer Evoca Kids handoff child experience for ages 8–10 inside the KidsBank shell while keeping the existing parent cabinet and shared demo state for parent–child flows.

## Requirements

### Requirement: Designer child home for age 8–10

When `childExperience` is `youngDesigner`, the system SHALL render the integrated designer handoff child shell at `/child` with the same interactive scope as the handoff demo child (home carousel, card design flow, savings/goals/tasks/stars/pet overlays, and demo payment flows), without replacing the KidsBank parent routes.

#### Scenario: Designer home after 8–10 onboarding

- **WHEN** the user selects age `8-10` and taps Continue
- **THEN** `/child` shows the designer handoff child UI and the child tab bar is hidden

#### Scenario: Profile matches other child experiences

- **WHEN** the user taps the child identity (name/avatar) on the designer child home
- **THEN** `/child/profile` opens with the same settings and role toggle as other child experiences

#### Scenario: Parent cabinet unchanged

- **WHEN** the user selects the parent role on `/child/profile` or uses the parent toggle on `/parent`
- **THEN** the existing KidsBank parent shell is shown

### Requirement: Designer child routing guard

When `childExperience` is `youngDesigner`, the system SHALL redirect any `/child/*` route other than `/child`, `/child/profile`, and onboarding paths to `/child` with replace navigation, so child flows stay inside the handoff shell.

#### Scenario: Block parallel young routes

- **WHEN** `childExperience` is `youngDesigner` and the user opens `/child/piggy`
- **THEN** the app navigates to `/child`

#### Scenario: Profile still reachable

- **WHEN** `childExperience` is `youngDesigner` and the user opens `/child/profile`
- **THEN** the profile screen is shown

### Requirement: Demo bridge for parent workflows

When `childExperience` is `youngDesigner`, task balances, card balance, piggy balance, star balance, transfer recipients (enabled/limits), reward goals progress, and parent wallet fields used by the parent cabinet SHALL stay consistent with `kidsbank.demo` when the parent confirms tasks or changes limits, within the same browser origin.

#### Scenario: Parent confirms task

- **WHEN** the parent confirms a task in `waitingParent` state while the child uses `youngDesigner`
- **THEN** the child designer task list and star balance reflect the confirmation after demo sync
