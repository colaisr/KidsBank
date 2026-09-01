## Context

`child-tasks-page` реализован: родитель создаёт задания через `AddTaskModal`, ребёнок выполняет, родитель подтверждает `waitingParent`. Редактирование и отмена — осознанный non-goal того change.

См. proposal.md — Why.

## Goals / Non-Goals

**Goals:**

- Секция активных заданий на `/parent`.
- `EditTaskModal` — reward + dueTime (как в AddTaskModal, без выбора шаблона).
- `cancelTask` для `open` / `inProgress` / `waitingParent`.
- Переиспользовать `TaskCard` read-only или новый компактный `ParentTaskRow`.

**Non-goals:**

- Edit `done`, change `templateId`, goals, `/parent/tasks` route.

## Decisions

### 1. Active tasks section on parent home

Между quick actions и «Ждут подтверждения»:

```
## Задания ребёнка
[ParentTaskRow] homework — 25★ до 18:00 [Изменить] [Отменить]
...
```

Фильтр: `statusId !== 'done'`. Сортировка: `waitingParent` первыми, затем остальные.

`waitingParent` строки **дублируют** контекст с секцией подтверждения — но с другими действиями (edit/cancel vs confirm). Альтернатива: объединить в одну секцию с тремя кнопками. **Решение:** одна секция «Задания ребёнка»; у `waitingParent` — кнопки «Подтвердить», «Изменить», «Отменить»; убрать отдельную секцию `pendingTasks` (упрощение IA).

### 2. Edit modal

`EditTaskModal({ task, open, onClose })`:
- Заголовок: `demo.tasks.{templateId}.title` (read-only)
- Chips reward + time input (reuse presets from `taskTemplates.ts`)
- Submit → `updateTask(state, taskId, { rewardStars, dueTime })`

Нельзя редактировать если `done`.

### 3. Cancel action

```ts
export function cancelTask(state: DemoState, taskId: string): DemoState {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task || task.statusId === 'done') return state;
  return { ...state, tasks: state.tasks.filter(t => t.id !== taskId) };
}
```

Отмена `waitingParent` не трогает `starsBalance` / `taskStats`.

### 4. Update action

```ts
export function updateTask(
  state: DemoState,
  taskId: string,
  patch: { rewardStars: number; dueTime: string },
): DemoState | 'notEditable' {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task || task.statusId === 'done') return 'notEditable';
  return {
    ...state,
    tasks: state.tasks.map(t =>
      t.id === taskId ? { ...t, ...patch } : t,
    ),
  };
}
```

Если `waitingParent` и reward уменьшен — при confirm начисляется **текущий** `rewardStars` (не пересчитываем историю).

### 5. Parent UI component

`ParentTaskRow`: title, reward, deadline, status badge, action buttons. Тема AMIO/Evoca — те же `parent-action-card` / feed стили.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Две секции про waitingParent | Объединить в одну «Задания ребёнка» |
| child-tasks-page не archived | Delta `parent-task-management` дополняет change delta; archive `child-tasks-page` первым |

## Migration Plan

Только фронт. Archive после `child-tasks-page` (или параллельно — дельты не конфликтуют).

## Open Questions

- Нет.
