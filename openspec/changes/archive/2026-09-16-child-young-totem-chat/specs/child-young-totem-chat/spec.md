## ADDED Requirements

### Requirement: Pet zone on young totem

The system SHALL show feed, play, and sleep with star costs on `/child/young/totem`, using shared `demo.pet` state and `applyPetAction` behavior. Need meters SHALL flank Leo as compact ring indicators; the chat area SHALL use approximately two-thirds of the viewport below the header.

#### Scenario: Care for Leo

- **WHEN** the child taps feed, play, or sleep with enough stars
- **THEN** fullness and joy update and stars are spent per teen pet rules

### Requirement: Chat with Leo

The system SHALL send conversation to a server proxy at `/api/kidsbank/leo/chat` without embedding Polza API keys in the frontend. The UI SHALL support text input, send, quick-reply chips, and Chrome speech dictation with `ru-RU`. While dictating, interim speech SHALL appear in a preview bubble above the input; finalized phrases SHALL append to the message field on pause.

#### Scenario: Ask Leo

- **WHEN** the child sends a message
- **THEN** Leo replies with child-appropriate financial guidance without inventing account balances
