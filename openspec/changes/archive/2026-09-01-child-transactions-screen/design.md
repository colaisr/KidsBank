## Context

Сейчас `ChildTransactionsPage` — `ChildPageTitle` + плоский `TransactionRow` без фильтров и группировки. Копилка (`ChildPiggyBankPage`) уже группирует по дням и рисует богатые иконки в `PiggyDepositRow`. `confirmTask` в `demoActions.ts` увеличивает `starsBalance`, но не пишет в `transactions[]`. Presenter sheet `child-transactions` уже подключён через `ChildPageTitle`, но copy не покрывает новые механики.

См. макет в change request: градиентная шапка, три фильтра, группы «Сегодня/Вчера», AMD и ★ в одной ленте.

## Goals / Non-Goals

**Goals:**

- Визуальная паритет с макетом и шапкой главной (`ChildHomeHeader`).
- Фильтры и сводка недели как лёгкая механика финграмотности.
- Единая лента AMD + ★; `taskReward` при confirm задания.
- Reuse форматирования дат из `format.ts` / копилки.
- Обновить presenter copy и demo seed.

**Non-Goals:**

- Pet ★ spends в истории, goal star transfers, родительский список, бэкенд, графики.

## Decisions

### 1. Шапка — отдельный компонент, не `ChildPageTitle`

`ChildTransactionsHeader`: градиент, звезда → goals, title, `PresenterBadgeWithSheet` (`variant="onGradient"`), `DemoSettingsLink` (`onGradient`). Фильтры и сводка — в нижней части шапки (как сегмент на макете) или immediately below header on same gradient block.

**Альтернатива:** расширить `ChildPageTitle` — отклонено: таб-экраны pet/transactions не должны ломать back-navigation pages.

### 2. Модель транзакции — optional поля, без bump version

Оставляем `DemoState.version = 4`. Расширяем `DemoTransaction`:

```ts
currency?: 'AMD' | 'STARS'; // default AMD
taskId?: string;            // taskReward
merchantKey?: string;       // spend → demo.merchants.*
```

Новый `typeId`: `taskReward`. Нормализация в `demoState.ts`: отсутствие `currency` → `AMD`.

**Альтернатива:** v5 bump — не нужен, поля optional и backward compatible.

### 3. Кредит / дебет и фильтры

| Filter | Показывать |
|--------|------------|
| all | всё |
| income | credit AMD + все `taskReward` (★) |
| expenses | debit AMD only |

Credit AMD: `parentToCard`, `parentToPiggy`, `goalRedeem`, `piggyCashback`, `piggyGiftMom`, `piggyGiftGrandma`, `piggyToCard`. Debit: `spend`, `childToParent`, `cardToPiggy`. Piggy-only deposits (`parentToPiggy`, gifts) остаются в общей истории — на экране копилки свой подсписок.

### 4. `TransactionRow` — иконки по типу

Перенести паттерн `PiggyDepositRow` / макет: цветной круг + SVG. Типы:

- `taskReward` — зелёный, галочка
- `spend` — оранжевый, QR grid
- `piggyCashback` — голубой, подарок
- `parentToCard`, `piggyGiftMom` — бежевый, буква из `demo.piggy.gift*` или «M»
- `cardToPiggy` — teal, копилка
- остальные — fallback по семейству transfer/spend

Подпись:

- `taskReward` → `ui.transactions.taskLabel` + `demo.tasks.{templateId}.title` / customTitle
- `spend` + `merchantKey` → `ui.transactions.qrSpend` + `demo.merchants.{key}`
- else → `demo.transactions.{typeId}`

Время: `formatPiggyDepositDate` или shared `formatTransactionSubtitle`.

### 5. Сводка недели

`useMemo` на `demo.transactions`: фильтр `at` в текущей ISO week (locale-aware start of week = Monday). Суммы:

- `+AMD` credits, `−AMD` debits (abs), `+★` sum of `taskReward` amounts in week (и seed ★ rows).

UI: `ui.transactions.weekSummary` с тремя плейсхолдерами. Chip под фильтрами, muted surface on gradient footer.

### 6. Demo seed

`createTransactionsSeed()` в `demoBaseline.ts` — 6 строк как на макете (today: taskReward homework +25★, spend sweetShop −180, cashback +8; yesterday: parentToCard +500, cardToPiggy −200, taskReward waterFlowers +10★). Даты — relative to `now` (как piggy seed). `cloneDemoBaseline()` мержит piggy deposits + transaction seed.

Hub demo spend: при `appendTransaction('spend')` передать `merchantKey: 'sweetShop'` (или random из 2–3 merchants).

### 7. `confirmTask` append

После начисления ★:

```ts
appendTransaction(state, 'taskReward', task.rewardStars, {
  currency: 'STARS',
  taskId: task.id,
});
```

Расширить `appendTransaction` optional meta.

### 8. Presenter sheet

`presenterSheets.ts` — добавить child rows: `dualCurrency`, `earnedVsSpent`; bank: `unifiedFeed`; demo steps: filter, summary, hub spend. Три локали `presenter.*.json`.

## Risks / Trade-offs

- **[Двойной счёт ★]** Confirm задания уже в `taskStats` — строка в истории дублирует информацию → **OK**: история для нарратива, stats для дашборда заданий.
- **[Piggy deposits в общей ленте]** Много строк от бабушки → **OK**: фильтр «Пополнения» показывает ценность; копилка — отдельный фокус.
- **[Старый localStorage]** Без новых seed rows до reset → **OK**: migration не перезаписывает; reset даёт полный макет.

## Migration Plan

1. Ship code + optional fields normalization.
2. No server deploy concerns (static).
3. Rollback: revert commit; old transactions without `currency` still work.

## Open Questions

- Нужна ли CTA «Сделать покупку» в empty state expenses filter → Hub? (рекомендация: yes, link to `/child/hub` — можно в tasks 4.x если согласуем при apply).
