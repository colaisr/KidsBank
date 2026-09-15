## Why

Young kids (6–10) need one screen to care for Leo **and** talk to him as a simple financial buddy — not separate placeholder «Поговорить» bubbles.

## What Changes

- `/child/young/totem`: compact hero (actions left, Leo center, need bars right), teen-equivalent pet actions (feed / play / sleep, ★ costs, XP, level-up).
- Bottom half: chat with Leo (Polza Flash via server proxy), quick replies, mic dictation (`ru-RU`, Chrome Web Speech).
- System prompt: child 6–10, financial literacy, no invented account data.
- VPS: `deploy/leo-chat` on `127.0.0.1:8091`, nginx `location /api/kidsbank/` before AI-tutor `/api/`.

### Non-goals

- Leo knowing real demo balances from API.
- hy/en chat quality beyond UI strings (model follows user language in prompt).

### Acceptance

- Young totem layout + pet parity with teen mechanics on this page.
- Chat works on preview when proxy is up; dictation fills input in Chrome.
- Key only in server `.env`, not in git; `npm run build`; hy/ru/en UI keys.

## Capabilities

- `child-young-totem-chat` (delta over `child-young-totem-leo`)
