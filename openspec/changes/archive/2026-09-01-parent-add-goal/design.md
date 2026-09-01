## Context

Цели: `GoalCard` на `/child/goals`, allocate ★, redeem → AMD. Baseline — `bike`, `ps5` с `demo.goals.{id}.title`. Задания уже имеют паттерн: шаблон + «Другое» + `customTitle`.

См. proposal.md — Why.

## Goals / Non-Goals

**Goals:**

- `AddGoalModal` на `/parent` (зеркало `AddTaskModal`).
- Каталог шаблонов + `other` + `customTitle`.
- Секция «Цели ребёнка» на главной родителя (read-only список).
- Миграция существующих целей: `templateId = id`.

**Non-goals:**

- Edit/cancel goals, child-created goals, `/parent/goals`.

## Decisions

### 1. Goal data model

```ts
type DemoGoalState = {
  id: string;
  templateId: string;       // bike | ps5 | headphones | other
  customTitle?: string;     // when templateId === 'other'
  iconId: GoalIconId;
  currentStars: number;
  targetStars: number;
  amdValue: number;
  redeemed: boolean;
};
```

Baseline `bike`/`ps5`: добавить `templateId` (= id). Новые цели: `id = custom-${Date.now()}` или `${templateId}-${Date.now()}`.

### 2. Template catalog

`src/data/goalTemplates.ts`:

```ts
export const GOAL_TEMPLATES = ['bike', 'ps5', 'headphones'] as const;
export const CUSTOM_GOAL_TEMPLATE_ID = 'other';
```

Пресеты при создании:
- `targetStars`: 500 / 800 / 1000 / 1500
- `amdValue`: 50000 / 120000 / 200000 / 250000 (чипы, как в демо)
- `iconId`: дефолт по шаблону; для `other` — выбор из `bike | gamepad | headphones`

Дубликат: нельзя две активные (`!redeemed`) цели с одним `templateId` (кроме `other`).

### 3. Parent UI

Quick actions: четвёртая кнопка **«Цель»** (рядом с Задание).

Секция под заданиями:

```
## Цели ребёнка
[ParentGoalRow] Велосипед — 650/800 ★
```

`ParentGoalRow`: title, progress, target ★, AMD value — без edit/cancel в этом change.

### 4. Child display

`getGoalTitle(goal, t)` в `lib/goals.ts` — как `getTaskTitle`.

`GoalCard` и home preview используют `getGoalTitle` вместо `demo.goals.${goal.id}`.

### 5. addGoal action

```ts
addGoal(state, { templateId, customTitle?, iconId, targetStars, amdValue })
  → 'duplicate' | 'emptyTitle' | DemoState
```

Новая цель: `currentStars: 0`, `redeemed: false`.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Surf «своё дело» vs родитель создаёт | Явная дельта в `01`; ребёнок всё равно копит и обменивает сам |
| 4 quick actions на AMIO grid | 2×2 сетка; Evoca — вертикальный feed |
| Старый localStorage без templateId | normalize в `demoState.ts` |

## Migration Plan

Только фронт. `normalizeDemoState`: `templateId ??= goal.id`.

## Open Questions

- Нет.
