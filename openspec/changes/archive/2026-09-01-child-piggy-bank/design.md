## Context

Фазы 1–3 закрыты: копилка на главной — только баланс; перевод родитель→копилка уже в `TransferModal` + `transferParentToChild`. Нет экрана копилки и истории пополнений. Макет: баланс, оранжевая карточка ссылки, список пополнений по дням.

## Goals / Non-Goals

**Goals:**

- `/child/piggy` по макету: hero-баланс, share-card, deposits grouped by relative day.
- Link из `piggy.shareSlug` + host по `data-theme` (`getPiggyShareUrl`).
- Фильтр `isPiggyDeposit()` для транзакций на экране копилки.
- Сид-пополнения с относительными датами (today/yesterday) в `cloneDemoBaseline()`.

**Non-goals:**

- Backend, реальный deep link, withdraw piggy→card.

## Decisions

### 1. Route and entry

`App.tsx`: `<Route path="piggy" element={<ChildPiggyBankPage />} />` внутри `ChildShell`.

`AccountsSection`: piggy tile — `<Link to="/child/piggy">` (зеркало stars→goals).

`ChildPageTitle` с `backTo="/child"`.

### 2. Demo state

```ts
piggy: { balance: number; shareSlug: string };

type TransactionTypeId =
  | ...existing
  | 'piggyCashback'
  | 'piggyGiftMom'
  | 'piggyGiftGrandma';
```

`createPiggySeedTransactions()` в `cloneDemoBaseline()` — даты от `new Date()` для группировки «Сегодня»/«Вчера».

`normalizeDemoState()` — backfill `shareSlug` для старых `kidsbank.demo`.

### 3. Share card

- URL: `{amio|evoca}.am/kopilka/{shareSlug}` — без `https` в поле (как на макете).
- Copy: `navigator.clipboard.writeText`.
- Share: `navigator.share` с fallback на copy.
- Ссылка декоративная — нет роута и внешнего лендинга.

### 4. Deposits UI

`PiggyDepositRow`: иконка по типу, `formatPiggyDepositDate` («Сегодня, 10:24»).

Группы: `getRelativeDayGroup` → `ui.piggy.dayToday|dayYesterday|dayEarlier`.

`parentToPiggy` от родительского перевода попадает в тот же список.

### 5. Parent transfer

Без изменений логики: `TransferModal` target toggle `card | piggy` (фаза 3). Change только документирует связь с экраном копилки.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Старый localStorage без piggy seed txs | Reset сценария или normalize при чтении |
| Share API недоступен на desktop | Fallback на copy |
| Evoca orange card | Токен `accent-kids`, одна вёрстка |

## Migration Plan

Только фронт. После archive — delta specs в main, журнал в `PlanDocs/19`.
