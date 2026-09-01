## Context

Фазы 1–3 закрыты: механика заданий (`open` → `inProgress` → `waitingParent` → `done` + ★) и подтверждение родителем на `/parent` уже работают через `TaskRow`. Экран `/child/tasks` — плоский список без статистики, дедлайнов и визуала макета. Родитель не может создавать задания.

Макет задаёт: карточки статистики (860 заработано / 31 выполнено), карточки заданий с бейджем ★, дедлайном «до HH:MM» и чекбоксом справа.

## Goals / Non-Goals

**Goals:**

- `/child/tasks` по макету: `TaskStatsCards` + `TaskCard` (замена `TaskRow` на полном экране).
- Расширить demo state: `templateId`, `dueTime`, `taskStats`.
- Baseline: 5 поручений как на макете (4 open + 1 done), без «Добавь новую цель» — это не задание.
- Родитель: `AddTaskModal` из quick actions на `/parent`.
- Компактный `TaskCard` на главной (первые 2 активных).
- i18n hy/ru/en для всех новых строк и шаблонов.

**Non-goals:**

- Редактирование/удаление заданий, свободный текст, отдельный `/parent/tasks`.
- Push, несколько детей, recurring tasks.

## Decisions

### 1. Task data model

```ts
type DemoTaskState = {
  id: string;           // unique, e.g. "homework" or "homework-1735..."
  templateId: string;     // i18n key: demo.tasks.{templateId}.title
  rewardStars: number;
  dueTime: string;        // "18:00" 24h
  statusId: 'open' | 'inProgress' | 'waitingParent' | 'done';
};

type TaskStats = {
  starsEarned: number;    // lifetime, baseline 860
  tasksCompleted: number; // lifetime, baseline 31
};
```

`templateId` отделён от `id`, чтобы родитель мог добавлять повторно тот же шаблон после `done` (но не пока активен — см. п. 5).

Миграция v2→v3 в `normalizeDemoState`: если нет `templateId`, `templateId = id`; если нет `dueTime`, подставить дефолт из baseline map; если нет `taskStats`, взять из baseline.

### 2. Template catalog

`src/data/taskTemplates.ts`:

```ts
export const TASK_TEMPLATES = [
  'homework', 'walkDog', 'hangLaundry', 'tidyRoom', 'dishes'
] as const;
```

Строки только в `demo.tasks.*`. Только бытовые поручения — **не** цели. Референс-макет содержал «Добавь новую цель» внизу списка; продуктово это ошибка макета / утечка с экрана целей; выполненное демо-поручение — `dishes`.

### 3. Baseline seed (per mockup)

| templateId   | reward | dueTime | status        |
|-------------|--------|---------|---------------|
| homework    | 25     | 18:00   | open          |
| walkDog     | 15     | 20:00   | open          |
| hangLaundry | 10     | 16:00   | open          |
| tidyRoom    | 15     | 19:30   | open          |
| dishes      | 10     | 17:00   | done          |

`taskStats`: `{ starsEarned: 860, tasksCompleted: 31 }`.

Все 4 активных — `open` (не `inProgress`/`waitingParent`), чтобы макет совпал с пустыми чекбоксами.

### 4. UI components

**`TaskStatsCards`** — два блока в ряд:
- Левый: оранжевый фон (`accent-kids`), число + `ui.tasks.statsEarned`, иконка ★.
- Правый: зелёный (`success` token или `primary` variant), число + `ui.tasks.statsCompleted`, иконка ✓.

**`TaskCard`** — заменяет `TaskRow` на `/child/tasks` и home preview:
- Белая карточка, мягкая тень (`shadow-card` если есть в теме).
- Верхний левый угол: бейдж `rewardStars ★` (оранжевый pill).
- Центр: заголовок `font-heading font-semibold`.
- Низ: иконка часов + `ui.tasks.deadline` с `dueTime` ИЛИ `ui.tasks.waitingParent` / `ui.tasks.done`.
- Справа: квадратный rounded checkbox 40×40:
  - `open`/`inProgress`: пустой border
  - `waitingParent`: border accent, disabled
  - `done`: зелёный fill + белая галочка

`TaskRow` остаётся для parent pending queue (read-only + confirm button) или заменяется на упрощённый read-only `TaskCard`.

### 5. Parent add-task flow

`AddTaskModal` на `/parent`:
- Select: шаблоны из `TASK_TEMPLATES`, фильтр — скрыть те, у кого уже есть active task с тем же `templateId`.
- Chips: reward 10 / 15 / 25 / 50 (default по шаблону).
- Time: `<input type="time">` или preset chips (16:00, 18:00, 20:00).
- Submit → `addTask(demo, { templateId, rewardStars, dueTime })` генерирует `id = \`${templateId}-${Date.now()}\``.

### 6. Actions update

`confirmTask` в `demoActions.ts`:
```ts
return {
  ...state,
  starsBalance: state.starsBalance + task.rewardStars,
  taskStats: {
    starsEarned: state.taskStats.starsEarned + task.rewardStars,
    tasksCompleted: state.taskStats.tasksCompleted + 1,
  },
  tasks: state.tasks.map(...)
};
```

`addTask`, `acceptTask`, `completeTask` — без изменений логики статусов; checkbox на `TaskCard` вызывает те же actions.

### 7. Sorting

`sortTasksForDisplay(tasks)`: `[...non-done in original order, ...done in original order]`.

### 8. Home preview

`ChildHomePage`: `demo.tasks.filter(t => t.statusId !== 'done').slice(0, 2)` → `TaskCard compact`.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Старый localStorage без `taskStats`/`dueTime` | `normalizeDemoState` backfill |
| Двойной компонент TaskRow vs TaskCard | TaskRow deprecated на child screens; parent keeps simple row or read-only TaskCard |
| «Заработано» vs `starsBalance` | Отдельное поле `taskStats.starsEarned` — не уменьшается при переводе ★ на цель |
| Evoca orange vs AMIO | Токены `accent-kids`, `success`; одна вёрстка |

## Migration Plan

Только фронт. Bump demo schema version при необходимости. После archive — delta specs в main, журнал в `PlanDocs/19`, блок B4 в `PlanDocs/01`.

## Open Questions

- Нет — макет и продуктовая модель согласованы: родитель создаёт, ребёнок чекбоксом, родитель подтверждает.
