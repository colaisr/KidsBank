## ADDED Requirements

### Requirement: Card skin layer via data attribute

The system SHALL support a card skin preference applied as `data-card-skin` on the document root, independent of `data-theme`. Valid values SHALL be: `ocean`, `space`, `dinosaurs`, `unicorns`, `robots`, `racing`.

#### Scenario: Default ocean skin

- **WHEN** no card skin is stored
- **THEN** `data-card-skin="ocean"` is set and the UI matches the current bank baseline accents

#### Scenario: Skin change without reload

- **WHEN** the user applies a new card skin on the card design screen
- **THEN** accent tokens update in place without a full page reload

### Requirement: Card skin overlays bank tokens without layout forks

Card skin styling SHALL override accent-related CSS variables (card gradient, primary, FAB, kids accent) through theme tokens only. Component markup SHALL NOT fork per skin.

#### Scenario: Structure unchanged on skin apply

- **WHEN** the user applies `space` skin on the child home
- **THEN** the DOM structure is unchanged; only colors, gradients, and card decorations update

### Requirement: Card skin scope is the child experience

Card skin token overrides SHALL affect the child cabinet screens. The parent shell SHALL retain bank-theme styling without card-skin accent shifts.

#### Scenario: Parent unaffected by child skin

- **WHEN** the child has `robots` skin active and the user switches to the parent role
- **THEN** parent home uses bank theme tokens only, without the child card-skin accent overlay
