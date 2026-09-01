## MODIFIED Requirements

### Requirement: Parent home uses bank-themed layout variants

The parent home SHALL use one information architecture and **one layout** for both banks. Quick actions SHALL appear in a **2×2 grid** on all themes. Switching `data-theme` SHALL change only color tokens (primary, gradients, surfaces, accents), not element order, size, or arrangement.

#### Scenario: AMIO parent layout

- **WHEN** theme is AMIO and role is parent
- **THEN** quick actions appear in a 2×2 grid with adult-banking spacing per `17-theme-bank-1`, using AMIO color tokens only

#### Scenario: Evoca parent layout

- **WHEN** theme is Evoca and role is parent
- **THEN** the same 2×2 quick-action grid appears with Evoca color tokens per `17-theme-bank-2`, not a separate feed layout or route set

#### Scenario: Theme switch preserves structure

- **WHEN** the user switches bank theme on `/parent`
- **THEN** section order, quick-action grid, and component sizes remain identical; only colors and gradients update

## ADDED Requirements

### Requirement: Parent home scrolls within phone frame

The parent cabinet shell SHALL allow vertical scrolling of all dashboard content when it exceeds the viewport height, consistent with the child cabinet scroll behavior.

#### Scenario: Long dashboard scrolls

- **WHEN** the parent opens `/parent` and content (balance, quick actions, tasks, goals, spending) exceeds the phone viewport
- **THEN** the user can scroll to the bottom spending section without content being clipped

#### Scenario: Header remains reachable

- **WHEN** the user scrolls the parent dashboard
- **THEN** the app header (title, presenter ℹ️, role toggle, appearance) remains visible or returns to the top of the scroll area without breaking layout

### Requirement: Parent home uses adult dashboard visual rhythm

The parent home SHALL present a cohesive adult-banking dashboard: gradient hero with greeting and child balance summary, `bg-surface-muted` content area, consistent section headings, and card-based lists — styled only with theme tokens (`--kb-*` / Tailwind theme aliases).

#### Scenario: Dashboard sections

- **WHEN** the parent views `/parent`
- **THEN** sections appear in order: balance hero, quick actions, child tasks, child goals, spending — with uniform vertical spacing between sections

#### Scenario: No kids styling on parent

- **WHEN** theme or card skin changes
- **THEN** the parent dashboard does not adopt child-only patterns (FAB, kids accent stars on actions, card-skin accents)
