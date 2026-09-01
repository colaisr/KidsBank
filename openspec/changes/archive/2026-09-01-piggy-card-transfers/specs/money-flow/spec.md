## ADDED Requirements

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
