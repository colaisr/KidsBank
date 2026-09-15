# child-young-totem-chat

## Purpose

Young totem screen combines Leo pet care (same demo mechanics as teen pet) with an LLM chat assistant for ages 6–10.

## Requirements

### Pet zone

- SHALL show feed, play, sleep with star costs and need bars on `/child/young/totem`.
- SHALL use shared `demo.pet` state and `applyPetAction` behavior.

### Chat zone

- SHALL send conversation to server proxy; SHALL NOT embed Polza API key in frontend.
- SHALL support text input, send, and Chrome dictation with `ru-RU`.
- SHALL show greeting and optional quick-reply chips (i18n).

### Leo persona

- SHALL answer as friendly Leo, simple financial topics, without claiming access to the child's balances.
