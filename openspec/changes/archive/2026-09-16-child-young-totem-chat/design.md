## Layout (6–10, v3)

- **Header:** slim — back, «Лео», level badge.
- **Grid под шапкой:** `1fr` pet + `2fr` chat → **чат ≈ ⅔** высоты.
- **Pet stage:** без бабла «Поиграем»; **кольцевые индикаторы** сытости (слева) и радости (справа), визуально меньше Лео (~7.5rem); под рядом — 3 действия.
- **Chat:** лист, быстрые ответы, ввод + диктовка.
- `ChildShell`: lock overflow on `/child/young/totem`.

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
