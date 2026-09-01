## Purpose

Lets demo presenters walk through a future first-login flow (role then child age) from profile settings without replacing the existing role switcher or persisting age.

## ADDED Requirements

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

### Requirement: Age choice does not affect demo state

The system SHALL NOT persist the selected age range to `kidsbank.demo`, `localStorage` onboarding keys, or any field that changes tasks, limits, goals, or shell styling. Age selection MAY exist only as ephemeral UI state on the age screen for the current visit.

#### Scenario: Continue after age selection

- **WHEN** the user selects any age range and taps Continue
- **THEN** the child home at `/child` is shown and demo balances, tasks, and limits are unchanged from before entering onboarding

#### Scenario: Re-enter onboarding

- **WHEN** the user opens onboarding again from profile settings after completing age selection
- **THEN** the age screen shows no pre-selected range from the prior visit (default selection per implementation, not persisted global state)

### Requirement: Onboarding screens hide child tab bar

The onboarding role and age screens SHALL be full-step views without the child bottom tab bar, consistent with other full-screen child flows (e.g. card design).

#### Scenario: No tab bar on onboarding

- **WHEN** the user is on the role or age onboarding screen
- **THEN** the child bottom navigation tab bar is not visible
