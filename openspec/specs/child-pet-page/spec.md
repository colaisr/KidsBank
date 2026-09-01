# child-pet-page Specification

## Purpose

Child pet care screen: Tamagotchi needs, star spending (not earning), task buff bridge, navigation hints, presenter value sheet, and tab attention badge.

## Requirements

### Requirement: Child pet screen replaces placeholder

The route `/child/pet` SHALL show a full pet care screen per the AMIO Junior mockup, not a placeholder message.

#### Scenario: Open pet tab

- **WHEN** the child taps the «Питомец» tab
- **THEN** the screen shows level badge, speech bubble, pet character, three need bars, and three care action buttons

### Requirement: Pet has three need meters

The pet SHALL track `fullness`, `joy`, and `energy` as integers from 0 to 100, displayed as labeled progress bars with percentages.

#### Scenario: Baseline needs match mockup

- **WHEN** demo state is reset to baseline
- **THEN** fullness is 80%, joy is 65%, and energy is 40%

### Requirement: Needs decay on tab revisit (demo-fast)

When the child returns to `/child/pet` after a prior visit in the same session (`visitCount > 0`), the system SHALL apply fixed revisit decay (−12 fullness, −10 joy, −15 energy) before rendering. The first visit after reset SHALL NOT decay.

#### Scenario: Revisit shows pet needs care again

- **WHEN** the child leaves `/child/pet`, opens another tab, and returns
- **THEN** need bars are visibly lower than before and the speech bubble prompts care again

### Requirement: Care actions cost stars and grant XP only

Care actions SHALL deduct stars from `starsBalance` per design (feed 5, play 8, sleep 3), update needs, increase `xp` by 10, and increment `careCount`. Care actions SHALL NOT increase `starsBalance`.

#### Scenario: Feed pet costs stars

- **WHEN** the child taps «Покормить» with `starsBalance` ≥ 5
- **THEN** fullness increases by 35, `starsBalance` decreases by 5, and `xp` increases by 10

#### Scenario: Insufficient stars blocks action

- **WHEN** `starsBalance` is less than the action cost
- **THEN** the action button is disabled and the speech bubble prompts earning stars in tasks

### Requirement: Task buff grants one free care action

When the parent confirms a task (`confirmTask`), the system SHALL set `pet.taskBuff` to true. The next care action SHALL cost 0 stars and then clear `taskBuff`.

#### Scenario: Free care after parent confirms task

- **WHEN** the parent confirms a waiting task and the child performs one care action
- **THEN** stars are not deducted and `taskBuff` becomes false

### Requirement: Pet level derives from lifetime XP

The displayed level SHALL be `floor(xp / 10) + 1`. Baseline `xp` 25 SHALL display as level 3. One care action from baseline SHALL advance to level 4 with a celebration.

#### Scenario: Level up in one action

- **WHEN** the child performs one care action from baseline (`xp` 25) with sufficient stars
- **THEN** the level badge shows level 4 and a level-up celebration is shown

### Requirement: Speech bubble navigates to product flows

The speech bubble SHALL reflect pet state per design and, when appropriate, navigate to `/child/tasks` (earn stars) or `/child/goals` (happy pet reminder) on tap.

#### Scenario: Low stars prompt tasks

- **WHEN** `starsBalance` is below 5 and the child taps the speech bubble
- **THEN** the app navigates to `/child/tasks`

#### Scenario: Happy pet prompts goals

- **WHEN** all needs are at least 70% and the child taps the speech bubble
- **THEN** the app navigates to `/child/goals`

### Requirement: Presenter info badge opens value sheet

A small muted info badge near the level badge SHALL open a bottom sheet with product value tables for the child, the bank, and a 90-second demo script. This is for presenter use during investor/bank demos.

#### Scenario: Open presenter sheet

- **WHEN** the user taps the info badge on `/child/pet`
- **THEN** a bottom sheet shows localized child value, bank value, and demo script sections

### Requirement: Pet tab shows attention badge

When the pet requires attention (first visit, `taskBuff`, low needs, or insufficient stars), the bottom-nav pet tab SHALL show a red dot badge unless the pet tab is currently active.

#### Scenario: Badge on other tabs

- **WHEN** the pet needs attention and the child is on the home tab
- **THEN** the pet tab icon shows a red dot

#### Scenario: Badge hidden on pet screen

- **WHEN** the child is on `/child/pet`
- **THEN** the pet tab does not show the red dot

### Requirement: Pet state persists in demo storage

Pet fields including `taskBuff` SHALL live in `kidsbank.demo` and reset with «Сбросить сценарий».

#### Scenario: Reset pet

- **WHEN** the user resets the demo scenario
- **THEN** pet state returns to baseline values

### Requirement: Themed pet visuals without layout fork

Pet UI SHALL use one layout for AMIO and Evoca, with character colors driven by `data-theme` tokens.

#### Scenario: Same layout in Evoca

- **WHEN** bank switches to Evoca on `/child/pet`
- **THEN** the pet screen structure stays the same and accent colors follow theme tokens

### Requirement: Localized pet copy

All pet UI strings SHALL use i18n keys (`ui.pet.*`, `demo.pet.*`) in hy, ru, and en.

#### Scenario: Pet strings follow locale

- **WHEN** the user switches locale on Appearance and opens `/child/pet`
- **THEN** need labels, action buttons, and speech hints render from `ui.pet.*` and `demo.pet.*` keys
