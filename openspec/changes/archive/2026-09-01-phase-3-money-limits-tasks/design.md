## Context

Фаза 2: `DemoState` v1 (card, piggy, stars, tasks, goals), родитель — заглушка, задания display-only. См. proposal — мотивация фазы 3.

## Goals / Non-Goals

**Goals:**

- Расширить `DemoState` v2: `parentWallet`, `cardLimit`, `transactions[]`, `goal.redeemed`.
- Хелперы мутаций в `src/context/demoActions.ts` (чистые функции над state).
- Родитель: `ParentHomePage` + модалки перевода/лимита; layout grid (AMIO) vs feed (Evoca) через `data-theme` классы, не отдельные роуты.
- Ребёнок: интерактив `TaskRow`/`GoalCard`, живые транзакции.

**Non-Goals:**

- Несколько детей, реальные платежи, маскот, игра.

## Decisions

### 1. Demo state v2

```ts
type DemoTransaction = {
  id: string;
  typeId: 'parentToCard' | 'parentToPiggy' | 'childToParent' | 'spend' | 'goalRedeem';
  amount: number;
  at: string; // ISO
};

type DemoState = {
  version: 2;
  parentWallet: number;
  card: { last4: string; balance: number };
  piggy: { balance: number };
  cardLimit: number | null;
  starsBalance: number;
  tasks: DemoTaskState[];
  goals: DemoGoalState & { redeemed?: boolean; amdValue: number };
  transactions: DemoTransaction[];
};
```

Миграция v1→v2 в `readDemoState`: добавить недостающие поля из baseline. Невалидное — baseline.

### 2. Demo actions (pure)

`demoActions.ts`: `acceptTask`, `completeTask`, `confirmTask`, `allocateStarsToGoal`, `redeemGoal`, `transferParentToChild`, `transferChildToParent`, `setCardLimit`, `clearCardLimit`, `demoSpend` (для демо-траты с проверкой лимита). Каждая возвращает новый `DemoState` + append transaction.

### 3. Parent home layout

Один компонент `ParentHomePage`, внутри:

- `ParentQuickActions` — `grid grid-cols-2` для AMIO, `space-y-3` card stack для Evoca (`[data-theme=evoca] &`).
- Секции: баланс ребёнка, действия, ожидающие задания, история трат.
- Модалки: `TransferModal`, `LimitModal` — controlled, i18n labels.

### 4. Task interaction

`TaskRow`: кнопка/тап по статусу. `waitingParent` — только просмотр у ребёнка. `done` — зачёркнуто/галочка.

`GoalCard`: кнопка «Добавить ★» (stepper или preset 50) если `starsBalance > 0` и не достигнут target. При `currentStars >= targetStars` — «Обменять» → AMD на карту.

### 5. Transactions list

`TransactionRow`: `t('demo.transactions.${typeId}')` + `formatMoney`. Child page + parent preview share component.

### 6. Presenter settings (child)

Маскот-чат в демо не реализуется (фаза 4). Иконка чата — вход в настройки презентера:

- `DemoSettingsLink` → `/child/profile` с `state: { from: location.pathname }`
- На главной — в `ChildHomeHeader`; на остальных экранах — в `ChildPageTitle`
- `ChildProfilePage`: `DemoSettingsPanel` + `RoleToggle`; `backTo` из `location.state.from ?? '/child'`
- `DemoSettingsPanel` — общий блок банк/язык/сброс; переиспользуется на `/appearance` (родитель, без роли)
- На `/child/profile` чат-иконка скрыта (`showSettingsLink={false}`)

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Сложный state для демо | Чистые actions + reset в «Оформлении» |
| v1 localStorage у зрителей | Миграция v1→v2 с defaults |
| Evoca feed vs AMIO grid ломает IA | Один набор секций, разный CSS |

## Migration Plan

Только фронт. После archive — фаза 3 закрыта в `19`.
