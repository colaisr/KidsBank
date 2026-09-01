## Purpose

Applies bank visual identity through a single layout and CSS theme tokens for AMIO and Evoca, switchable at runtime.

## ADDED Requirements

### Requirement: Two bank themes via data attribute

The system SHALL expose exactly two themes: `amio` and `evoca`, selected by setting `data-theme` on the document root (`<html>`).

#### Scenario: AMIO theme active

- **WHEN** the active bank preference is `amio`
- **THEN** `data-theme="amio"` is set and AMIO color tokens (cerulean primary, warm accents) apply

#### Scenario: Evoca theme active

- **WHEN** the active bank preference is `evoca`
- **THEN** `data-theme="evoca"` is set and Evoca color tokens (violet primary, lilac surfaces) apply

### Requirement: One layout, no theme-specific markup forks

The system SHALL use the same component tree and markup for both themes. Visual differences MUST come only from CSS variables / theme tokens, not duplicated layouts.

#### Scenario: Theme switch preserves structure

- **WHEN** the user switches from AMIO to Evoca
- **THEN** the DOM structure of the current screen is unchanged; only colors, fonts, and theme-specific styling update

### Requirement: Theme switch without full page reload

The system SHALL change the active theme in place without reloading the entire page.

#### Scenario: Runtime theme change

- **WHEN** the user selects a different bank on the appearance screen
- **THEN** the visible UI re-themes within 350ms without a white flash or full document reload

### Requirement: Theme tokens align with bank guidelines

AMIO tokens SHALL reflect cerulean/atoll primary palette; Evoca tokens SHALL include mandatory violet (`#6400DC`) on every screen.

#### Scenario: Evoca violet present

- **WHEN** Evoca theme is active on any shell screen
- **THEN** at least one primary UI element uses the Evoca violet token
