## Context

Единый stakeholder-макет меню родителя: сервисные строки с иконками, статусами и бейджами. Перевод и геолокация уже в отдельных changes; **лимиты** и **задания** доводим здесь.

## Goals

- Меню «Сервисы» как точка входа; quick actions только для «мгновенных» действий (цель).
- Limits: две карточки-секции (переводы / наличные), токены темы, `ParentToggle`, `ParentBottomSheet` для нового получателя.
- Tasks: gradient CTA, uppercase section labels, compact rows с иконкой-состоянием; confirm через sheet для `waitingParent`.
- Orange badge (`accent-secondary`) на service row для счётчика подтверждений.

## Decisions

1. **Demo v7** для limits; `completedAt` optional на tasks без отдельного version bump (нормализация в `normalizeTask`).
2. **Completed today** — filter `done` + `completedAt` same local day; сид выставляет `tidyRoom` на сегодня в `cloneDemoBaseline`.
3. **Badge** только `waitingParent`, не все активные задания.
4. **LimitModal** остаётся неиспользуемым; card spend limit (`cardLimit`) — отдельный будущий блок при необходимости.

## Risks

- Старый localStorage v6 мигрирует limits fields автоматически; tasks без `completedAt` просто не попадут в «сегодня».
