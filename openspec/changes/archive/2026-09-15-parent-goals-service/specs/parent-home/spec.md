## MODIFIED Requirements

### Requirement: Parent home shows control dashboard

The parent home SHALL display: child summary (card balance, piggy balance), a **services** section (geolocation, transfer, limits, tasks, reports, spending history, **goals**), and spending history preview. It SHALL NOT show quick actions, inline child tasks, or an inline child goals section.

#### Scenario: Parent home loads

- **WHEN** the active role is `parent` and the user opens `/parent`
- **THEN** a localized dashboard shows services only (goals as the last row) and spending preview — without quick actions or goals list blocks

### Requirement: Parent home uses bank-themed layout variants

The parent home SHALL use one information architecture and **one layout** for both banks. The home SHALL NOT expose a quick-actions grid in the demo. Switching `data-theme` SHALL change only color tokens (primary, gradients, surfaces, accents), not element order, size, or arrangement.

#### Scenario: AMIO parent layout

- **WHEN** theme is AMIO and role is parent
- **THEN** the services section uses adult-banking spacing per `17-theme-bank-1`, using AMIO color tokens only

#### Scenario: Evoca parent layout

- **WHEN** theme is Evoca and role is parent
- **THEN** the same layout appears with Evoca color tokens per `17-theme-bank-2`, not a separate feed layout or route set

#### Scenario: Theme switch preserves structure

- **WHEN** the user switches bank theme on `/parent`
- **THEN** section order, services section, and component sizes remain identical; only colors and gradients update

## REMOVED Requirements

### Requirement: Parent home lists active child goals

**Reason:** Goals moved to `/parent/goals` via services menu.

**Migration:** Parents open **Сервисы → Цели**.
