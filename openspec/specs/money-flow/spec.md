# money-flow Specification

## Purpose

Demonstrates parent-child money movement and card spending limits as Surf B1 scenarios in local demo state.

## Requirements

### Requirement: Parent can transfer AMD to child

The system SHALL allow the parent to transfer a demo amount from the parent wallet to the child's card or piggy balance.

#### Scenario: Transfer to child card

- **WHEN** the parent initiates a transfer to the child's card with a valid amount
- **THEN** parent wallet decreases, child card balance increases, and a transaction record is appended

#### Scenario: Transfer to child piggy

- **WHEN** the parent initiates a transfer to the child's piggy with a valid amount
- **THEN** parent wallet decreases, piggy balance increases, and a transaction record is appended

### Requirement: Child can transfer AMD to parent

The system SHALL allow a demo transfer from the child's card to the parent wallet up to available card balance.

#### Scenario: Transfer to parent

- **WHEN** the child initiates a transfer to parent with amount ≤ card balance
- **THEN** card balance decreases, parent wallet increases, and a transaction record is appended

### Requirement: Child can transfer AMD between card and piggy

The system SHALL allow the child to move demo AMD between the card balance and piggy balance. Card spending limits SHALL NOT apply to card-to-piggy transfers.

#### Scenario: Card to piggy

- **WHEN** the child transfers a valid amount from card to piggy
- **THEN** card balance decreases, piggy balance increases, and a `cardToPiggy` transaction is appended

#### Scenario: Piggy to card

- **WHEN** the child transfers a valid amount from piggy to card
- **THEN** piggy balance decreases, card balance increases, and a `piggyToCard` transaction is appended

#### Scenario: Card limit does not block savings

- **WHEN** an active card limit exists and the child transfers card to piggy within card balance
- **THEN** the transfer succeeds

### Requirement: Parent can set and clear card spending limit

The system SHALL support an optional daily spending limit on the child's card. When set, demo purchases that would exceed the limit SHALL be blocked with a localized message.

#### Scenario: Set limit

- **WHEN** the parent sets a daily limit amount
- **THEN** `cardLimit` is stored in demo state and shown on the limit quick action and child hub/card views

#### Scenario: Clear limit

- **WHEN** the parent clears the limit
- **THEN** `cardLimit` is null and spending is not blocked by limit

#### Scenario: Blocked by limit

- **WHEN** a demo spend would exceed the active daily limit
- **THEN** the spend does not apply and the user sees a localized limit message

### Requirement: Parent sees child spending history

The parent home SHALL show recent child transactions (transfers and demo spends) from demo state.

#### Scenario: Spending visible to parent

- **WHEN** the parent opens the spending section
- **THEN** transactions are listed newest-first with localized type labels and AMD amounts

### Requirement: Hub demo actions provide feedback

Child hub demo spend and transfer actions SHALL show card balance, success confirmation, and error states (limit blocked, insufficient funds).

#### Scenario: Spend confirmation

- **WHEN** the child completes a demo spend from hub
- **THEN** a localized success message is shown and card balance updates
