## Why

Кабинет родителя переводится на **сервисные плашки**; цели — последний пункт меню. Создание и просмотр целей уходят с главной на отдельный экран (как задания).

## What Changes

- **`/parent/goals`:** заголовок, CTA «+ Новая цель» → `AddGoalModal`, список активных целей (`ParentGoalRow`).
- **`/parent`:** убрать блок **«Быстрые действия»** и секцию **«Цели ребёнка»**; добавить плашку **«Цели»** последней в сервисах.
- Specs: `parent-home`, `parent-goal-management`, `app-shell`; новая capability `parent-goals`.

### Non-goals

- Редактирование/удаление целей, новые поля цели.
- Изменение child goals flow.

### Acceptance

- hy / ru / en; `npm run build`; PlanDocs `01`.

## Capabilities

### New

- `parent-goals`

### Modified

- `parent-home`
- `parent-goal-management`
- `app-shell`
