## Context

`ChildGoalsPage` — `ChildPageTitle` + `StarsWalletCard` + вертикальный список `GoalCard`. Транзакции уже получили `ChildTransactionsHeader` + `HeaderPresenterActions`. Макет целей: шапка + баннер + сетка с двумя состояниями карточки.

См. proposal.md — мотивация. Флоу allocate/redeem уже в `demoActions.ts`.

## Goals / Non-Goals

**Goals:**

- Визуальный паритет с макетом (градиент, баннер, 2-col grid, тоны карточек).
- Каталог как механика **выбора мечты** (ценность для ребёнка и банка).
- Сохранить +50 ★ / обмен в sheet по тапу на активную карточку.
- ℹ️ через `HeaderPresenterActions`.

**Non-Goals:**

- Редизайн главной превью целей (compact `GoalCard` остаётся функциональным).
- Родительский add-goal UI.

## Decisions

### 1. Каталог — статика в `goalCatalog.ts`, не в `localStorage`

```ts
type GoalCatalogEntry = {
  templateId: string;
  iconId: ActivityIconId;
  targetStars: number;
  amdValue: number;
  cardTone: 'navy' | 'peach' | 'cyan';
};
```

Витрина = `GOAL_CATALOG` минус шаблоны с активной unredeemed целью. Custom goals (`other`) только от родителя — не в каталоге.

**Альтернатива:** каталог в demo state — отклонено: фикстуры не должны сбрасываться отдельно от baseline goals.

### 2. `activateCatalogGoal` в `demoActions.ts`

По аналогии с `addGoal` parent flow, но без модалки — данные из catalog entry. `isActiveGoalTemplate` блокирует дубликат.

### 3. Компоненты

| Компонент | Роль |
|-----------|------|
| `ChildGoalsHeader` | Градиент + баннер ★ (как фильтры у транзакций) |
| `GoalCatalogCard` | Сетка: tone top + icon + bottom content |
| `GoalActionSheet` | allocate + redeem для активной цели |

Тап на активную карточку → sheet. Каталог — только кнопка «Выбрать».

### 4. Сид baseline (макет)

| templateId | UI | target | current | catalog? |
|------------|-----|--------|---------|----------|
| `ps5` | Приставка | 1500 | 600 | active |
| `sneakers` | Кроссовки | 430 | 86 | active |
| `bike` | Велосипед | 2200 | — | catalog |
| `skateboard` | Скейтборд | 900 | — | catalog |
| `book` | Книга | 150 | — | catalog |
| `headphones` | Наушники | 1100 | — | catalog |

Убрать старый bike/ps5 из baseline как единственные цели — заменить на сид выше. Home preview bike goal may need update — home shows first active goal; ps5 or sneakers will show.

### 5. Карточки — тоны через Tailwind

- `navy`: `bg-slate-800`
- `peach`: `bg-orange-100`
- `cyan`: `bg-sky-100`

Иконка через `ActivityIcon` / emoji в цветном блоке.

### 6. Локали

- `ui.goals.starsBanner`, `inProgress`, `select`, `catalogTitle` (optional)
- `demo.goals.sneakers`, `skateboard`, `book` titles (headphones/bike/ps5 exist)
- Presenter: `choice`, `catalog`, demo steps «Выбрать → +★ → обмен»

### 7. Шапка — звезда слева

На табе «Цели» левая звезда — визуальный якорь (как макет), без навигации или `aria-current`. Не ссылка на себя.

## Risks / Trade-offs

- **[Два источника целей]** Родитель + каталог → **[OK]** одна сетка, одинаковые карточки для активных.
- **[Home preview]** Первый active goal может быть ps5 — **[OK]** compact card still works.

## Open Questions

- Нет — макет и механики зафиксированы в proposal.
