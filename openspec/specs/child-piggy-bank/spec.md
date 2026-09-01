# child-piggy-bank Specification

## Purpose

Dedicated child piggy-bank screen: balance, demo share link, and deposit history grouped by day.

## Requirements

### Requirement: Child piggy bank screen shows balance and total label

The system SHALL provide `/child/piggy` with the piggy icon, total AMD balance from demo state, and a localized «total saved» label.

#### Scenario: Balance from demo state

- **WHEN** the user opens `/child/piggy`
- **THEN** the balance matches `demo.piggy.balance` formatted in AMD for the active locale

### Requirement: Piggy bank screen shows demo share link card

The screen SHALL show an orange share card with a bank-specific demo URL (`{host}/kopilka/{shareSlug}`), copy control, and share button. The URL SHALL NOT navigate to a real payment page.

#### Scenario: Link reflects bank theme

- **WHEN** bank is AMIO on the piggy screen
- **THEN** the displayed link uses host `amio.am` and `demo.piggy.shareSlug`

#### Scenario: Copy link feedback

- **WHEN** the user taps copy on the share card
- **THEN** the link text is copied to clipboard and a localized confirmation is shown

### Requirement: Piggy bank screen lists deposits grouped by day

The screen SHALL list piggy deposit transactions newest-first, grouped under localized day headers (today, yesterday, earlier). Deposits include seed types (`piggyCashback`, `piggyGiftMom`, `piggyGiftGrandma`), live `parentToPiggy` transfers, and child-initiated `cardToPiggy` transfers.

#### Scenario: Parent transfer appears in deposits

- **WHEN** the parent transfers to the child's piggy and the child opens `/child/piggy`
- **THEN** a new deposit row with type `parentToPiggy` appears at the top of the list

#### Scenario: Card to piggy appears in deposits

- **WHEN** the child transfers from card to piggy on the piggy screen
- **THEN** a new deposit row with type `cardToPiggy` appears in the deposits list

#### Scenario: Empty deposits state

- **WHEN** no piggy deposit transactions exist in demo state
- **THEN** a localized empty state is shown

### Requirement: Child can move AMD between card and piggy on piggy screen

The piggy screen SHALL offer «deposit from card» and «withdraw to card» actions that open an amount modal with presets. Actions SHALL NOT modify the child home layout.

#### Scenario: Deposit from card

- **WHEN** the child confirms a valid card-to-piggy amount on `/child/piggy`
- **THEN** card balance decreases, piggy balance increases, and success feedback is shown

#### Scenario: Withdraw to card

- **WHEN** the child confirms a valid piggy-to-card amount on `/child/piggy`
- **THEN** piggy balance decreases, card balance increases, and success feedback is shown

#### Scenario: Insufficient funds

- **WHEN** the child selects an amount greater than the source balance
- **THEN** the transfer is blocked and a localized insufficient-funds message is shown

### Requirement: Piggy bank screen uses standard child chrome

The piggy screen SHALL use `ChildPageTitle` with back navigation to `/child` and presenter settings link per `child-nav`.

#### Scenario: Back to home

- **WHEN** the user taps back on the piggy screen
- **THEN** `/child` opens
