# profile-onboarding Specification

## Purpose

Lets demo presenters walk through a future first-login flow (role then child age) from profile settings without replacing the existing role switcher. Age selection persists `childExperience` for young (6–10) vs teen (10–12+) home layouts.

## Requirements

### Requirement: Profile child card opens onboarding role screen

The system SHALL make the demo child identity card on `/child/profile` (avatar + localized name, e.g. David) open the onboarding role selection screen when tapped.

#### Scenario: Tap David on profile settings

- **WHEN** the user is on `/child/profile` and taps the child identity card
- **THEN** the onboarding role selection screen is shown

#### Scenario: Role toggle remains available

- **WHEN** the user is on `/child/profile`
- **THEN** the existing child/parent role toggle section remains visible and functional below the child card

### Requirement: Role selection screen content

The onboarding role selection screen SHALL display a localized heading, sub-caption, bank-branded header area, two large tappable cards (parent and child) with icon, title, and short description, and a footer tagline — matching the presenter mockup layout.

#### Scenario: Localized role screen

- **WHEN** the role selection screen is shown with locale `hy`, `ru`, or `en`
- **THEN** all visible strings come from i18n keys, not hardcoded text

#### Scenario: Theme tokens on role screen

- **WHEN** the active bank theme is AMIO or Evoca
- **THEN** the role selection screen uses the same layout and active theme tokens (parent card primary, child card accent), not a separate layout fork

### Requirement: Parent card navigates to parent cabinet

The system SHALL navigate to the parent cabinet when the user taps the parent role card on the onboarding role selection screen.

#### Scenario: Choose parent

- **WHEN** the user taps the parent card on the role selection screen
- **THEN** the parent shell at `/parent` is shown

### Requirement: Child card opens age selection screen

The system SHALL show the child age selection screen when the user taps the child role card on the onboarding role selection screen.

#### Scenario: Choose child

- **WHEN** the user taps the child card on the role selection screen
- **THEN** the child age selection screen is shown

### Requirement: Age screen presenter value sheet

The child age selection screen SHALL expose the same muted presenter info badge (ℹ️) used on other P0 child screens. Tapping it SHALL open a bottom sheet with localized value for child, bank, and demo walkthrough via `ui.presenter.sheets.onboarding-age` in presenter locale files.

#### Scenario: Open presenter sheet on age screen

- **WHEN** the user is on the age selection screen and taps the presenter info badge in the header
- **THEN** a bottom sheet opens with child value rows, bank value rows, and demo steps in the active locale

#### Scenario: Presenter copy not in main locales

- **WHEN** the presenter sheet is shown
- **THEN** presenter script strings come from `presenter.{hy,ru,en}.json`, not hardcoded in components

### Requirement: Age selection screen content

The child age selection screen SHALL display a back control, localized title «Child age» / equivalent, presenter info badge in the header row, a two-step progress indicator (step 2 active), subtitle explaining personalization, five selectable age-range options (6–8, 8–10, 10–12, 12–14, 14–17 years) each with emoji icon and radio-style selection, and a primary «Continue» button.

#### Scenario: Select age range

- **WHEN** the user taps an age-range option
- **THEN** that option appears selected and previously selected option is deselected

#### Scenario: Back from age screen

- **WHEN** the user taps back on the age selection screen
- **THEN** the role selection screen is shown again

### Requirement: Onboarding screens hide child tab bar

The onboarding role and age screens SHALL be full-step views without the child bottom tab bar, consistent with other full-screen child flows (e.g. card design).

#### Scenario: No tab bar on onboarding

- **WHEN** the user is on the role or age onboarding screen
- **THEN** the child bottom navigation tab bar is not visible

### Requirement: Age choice drives child experience

The system SHALL map the selected onboarding age range to `childExperience` when the user taps Continue: `6-8` and `8-10` → `young`; `10-12`, `12-14`, and `14-17` → `teen`. The mapping SHALL be persisted to `kidsbank.childExperience` and the selected range to `kidsbank.childAgeRange`. Demo balances and tasks in `kidsbank.demo` SHALL remain unchanged by age selection alone.

#### Scenario: Continue after young age selection

- **WHEN** the user selects `8-10` and taps Continue
- **THEN** the young child home is shown and `kidsbank.childExperience` is `young`

#### Scenario: Continue after teen age selection

- **WHEN** the user selects `10-12` and taps Continue
- **THEN** the existing teen child home is shown with the tab bar

#### Scenario: Demo data unchanged by age alone

- **WHEN** the user selects any age range and taps Continue
- **THEN** the child home is shown and demo balances, tasks, and limits are unchanged from before entering onboarding

#### Scenario: Re-enter onboarding restores selection

- **WHEN** the user opens the age screen again after a prior Continue
- **THEN** the previously selected age range is pre-selected
