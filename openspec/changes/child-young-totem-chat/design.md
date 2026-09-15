## Layout (6–10, v2)

- **Header:** slim — back, «Лео», level badge.
- **Pet stage (~≤38vh, shrink-0):** одна карточка-сцена с лёгким градиентом:
  - сверху реплика-чип, **крупный Лео по центру** (~8.75–9.25rem), тап = «поиграть»;
  - под львом **ряд из 3 действий** (крупные зоны нажатия, как teen pet);
  - **две полоски в одну строку** (сытость | радость).
- **Chat (~flex 1.35):** основная высота экрана — лист, быстрые ответы, ввод + диктовка.
- `ChildShell`: lock overflow on `/child/young/totem` so chat scroll is internal.

Rationale: боковые колонки давали «пустоту» вокруг мелкого героя; вертикальная сцена + горизонтальные контролы читаются детьми и отдают чату ~55–60% viewport.

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
