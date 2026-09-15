## Layout

- **Header:** back, «Лео», level badge (from `petLevel(xp)`).
- **Pet row (~40% viewport max):** 3 columns — `YoungLeoPetActions` | chibi Leo ~5.5rem + speech chip | `YoungLeoPetNeedBars` (fullness, joy).
- **Chat (~flex-1):** message list, quick pills, input + dictation + send.
- `ChildShell`: lock overflow on `/child/young/totem` like young home so chat scroll is internal.

## Pet

- Reuse `applyPetAction`, costs, `tickPetOnVisit` via `useYoungLeoPet` (same rules as teen `ChildPetPage`).

## Chat API

- Browser → `POST /api/kidsbank/leo/chat` `{ messages: [{role, content}] }` → `{ reply }`.
- Dev: Vite proxy to `127.0.0.1:8091`.
- Prod: nginx prefix `/api/kidsbank/` → leo-chat container.

## Dictation

- `SpeechRecognition` / `webkitSpeechRecognition`, `lang = ru-RU`, interim + final update `draft`.

## Prompt

- `deploy/leo-chat/leo-system-prompt.txt` — persona, boundaries, no PII/balances.
