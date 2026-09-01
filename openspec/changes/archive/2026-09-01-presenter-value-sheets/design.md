## Context

Паттерн родился в `child-pet-page`: muted ℹ️ → bottom sheet с тремя секциями. Задача — масштабировать на весь прототип показа, не превращая UI в «презентацию PowerPoint».

Принцип: **главная = North Star продукта; остальные экраны = рычаги**. Ведущий на `/child` объясняет зачем KidsBank банку; на остальных — какая механика доставляет эту ценность.

## Goals / Non-Goals

**Goals:**

- Один переиспользуемый sheet-компонент.
- Карта размещения по всем экранам (P0 / P1 / skip).
- Готовый copy (child / bank / demo) в i18n для каждого `presenterId`.
- Секционные sheet на главной ребёнка.

**Non-goals:**

- Бейдж на каждой кнопке/модалке.
- Скрытие бейджей по флагу (YAGNI для прототипа).

## Decisions

### 1. Общий компонент

```tsx
<PresenterInfoBadge onClick={() => setOpen(true)} />
<PresenterValueSheet
  presenterId="child-home"
  open={open}
  onClose={() => setOpen(false)}
/>
```

`PresenterValueSheet` читает i18n:

| Ключ | Содержание |
|------|------------|
| `ui.presenter.<id>.title` | Заголовок sheet |
| `ui.presenter.<id>.subtitle` | «Для показа инвестору / банку» |
| `ui.presenter.<id>.childTitle` | Секция |
| `ui.presenter.<id>.child.<row>.topic` / `.meaning` | 3–4 строки |
| `ui.presenter.<id>.bank.<row>.effect` / `.meaning` | 3–4 строки |
| `ui.presenter.<id>.demoTitle` | Секция |
| `ui.presenter.<id>.demo.step1`…`stepN` | 3–6 шагов |
| `ui.presenter.close` | Общая кнопка (shared) |

Конфиг строк в `src/data/presenterSheets.ts`:

```ts
export const PRESENTER_SHEET_ROWS = {
  'child-home': { child: ['overview', ...], bank: [...], demoSteps: 5 },
  ...
} as const;
```

### 2. Размещение бейджа (UI)

| Контекст | Где ℹ️ |
|----------|--------|
| `ChildHomeHeader` (gradient) | Справа от заголовка «Главный», перед чатом — `text-white/40` |
| `ChildPageTitle` (sub-pages) | Справа от `<h1>`, перед `DemoSettingsLink` |
| `ParentHomePage` | В шапке блока баланса, top-right карточки |
| Секция на главной | В `SectionHeading` — мини ℹ️ 16px у заголовка секции |

Правило видимости: `opacity-50`, hover чуть ярче; **не** primary CTA.

### 3. Карта экранов — где делаем

#### P0 — обязательно (page-level sheet)

| Route | `presenterId` | Механика / блок | Где ℹ️ на экране |
|-------|---------------|-----------------|------------------|
| `/child` | `child-home` | Хаб B1+B4: счета, превью заданий/целей | `ChildHomeHeader`, между title и чатом |
| `/child/tasks` | `child-tasks` | B4 задания: заработай ★, родитель подтверждает | `ChildPageTitle` row |
| `/child/goals` | `child-goals` | B4 цели: копи ★ → обмен AMD | `ChildPageTitle` row |
| `/child/piggy` | `child-piggy` | Копилка, ссылка, пополнения, карта↔копилка | `ChildPageTitle` row |
| `/child/card-design` | `child-card-design` | B6 скин карты → тема кабинета | `ChildPageTitle` row |
| `/child/transactions` | `child-transactions` | История трат, прозрачность | `ChildPageTitle` row |
| `/child/pet` | `child-pet` | B7 тамагочи (**уже есть** → refactor) | У бейджа уровня (как сейчас) |
| `/child/hub` | `child-hub` | FAB: трата, лимит, перевод родителю | `ChildPageTitle` row |
| `/parent` | `parent-home` | B1 контроль: переводы, задания, цели, лимит, траты | Карточка баланса ребёнка |
| `/appearance` | `appearance` | Два банка × три языка, white-label | Под заголовком «Оформление» |

#### P1 — секционные sheet (только `/child`)

| Секция на главной | `presenterId` | Фокус |
|-------------------|---------------|-------|
| «Счета» (`AccountsSection`) | `child-accounts` | Карта + копилка + ★ как три кошелька |
| «Задания» (превью) | `child-tasks` | Reuse id (тот же sheet) |
| «Цели» (превью) | `child-goals` | Reuse id |

Секционный ℹ️ не дублирует page sheet — даёт **узкий** angle (3 строки child/bank, 2 шага demo).

#### Skip — не делаем (и почему)

| Route | Причина |
|-------|---------|
| `/child/profile` | Служебный hub настроек презентера; ценность = сам «Оформление» |
| `ChildShell` | Layout без контента |
| `ParentShell` | Layout без контента |
| Модалки (Transfer, Limit, AddTask…) | Достаточно sheet родительского/дочернего экрана; иначе шум |

### 4. Содержание sheet (черновик copy для i18n)

Ниже — смысл для `ru`; в реализации — hy/ru/en.

#### `child-home` (North Star — ценность всего приложения)

**Ребёнок:** ежедневная привычка; грамотность через действие; агентность (заработал → выбрал).  
**Банк:** daily engagement / DAU; ранний LTV с 8–12 лет; семья в одной экосистеме (родитель в приложении).  
**Демо:** экранный walkthrough (счета → карта → задания → цели → hub).

#### `child-accounts` (рычаг: три кошелька)

**Ребёнок:** три кошелька — разные задачи.  
**Банк:** cross-sell карта + копилка + геймификация.  
**Демо:** 1) Карта → card-design 2) Копилка → piggy.

#### `child-tasks`

**Ребёнок:** договор с родителем; сделал → ★.  
**Банк:** семейный контракт в приложении; engagement без выплат с банка.  
**Демо:** 1) Чекбокс → waiting 2) Родитель confirm → ★ + taskBuff питомцу.

#### `child-goals`

**Ребёнок:** своё дело; копишь ★ на мечту.  
**Банк:** отложенное удовольствие; связь ★ с реальным AMD на карту.  
**Демо:** 1) +50 ★ на велосипед 2) Обменять → AMD на карту.

#### `child-piggy`

**Ребёнок:** копилка ≠ карта; ссылка для близких.  
**Банк:** viral loop (мама/бабушка); P2P-пополнения в семье.  
**Демо:** 1) Ссылка 2) Пополнения списком 3) С карты в копилку.

#### `child-card-design`

**Ребёнок:** мой банк — мой стиль.  
**Банк:** персонализация без форка приложения; TEENZ-референс.  
**Демо:** 1) Выбрать скин 2) Вернуться на главную — цвета сменились.

#### `child-transactions`

**Ребёнок:** вижу, куда ушли деньги.  
**Банк:** финансовая грамотность; родитель тоже видит (parent-home).  
**Демо:** 1) Список 2) Hub → покупка 600 → новая строка.

#### `child-pet` (refactor)

Уже в `ui.pet.presenter.*` → мигрировать в `ui.presenter.child-pet.*` + alias/deprecate старых ключей.

#### `child-hub`

**Ребёнок:** трачу сам; лимит учит планировать.  
**Банк:** реальный spend + parental control demo.  
**Демо:** 1) Покупка 600 2) Лимит блокирует 3) Перевод родителю 200.

#### `parent-home`

**Ребёнок:** (через родителя) правила и поддержка.  
**Банк:** второй кабинет — контроль без токсичного надзора; monetization family bundle.  
**Демо:** 1) Перевод 2) Задание 3) Confirm 4) Лимит 5) Траты внизу.

#### `appearance`

**Ребёнок:** — (мета-экран).  
**Банк:** один прототип — два банка; армянский из коробки.  
**Демо:** 1) AMIO → Evoca 2) ru → hy 3) Сброс сценария.

### 5. Миграция питомца

- Перенести `PresenterInfoBadge` → `components/PresenterInfoBadge.tsx`.
- `PetPresenterSheet` удалить; `ChildPetPage` использует `PresenterValueSheet presenterId="child-pet"`.
- Перенести ключи `ui.pet.presenter.*` → `ui.presenter.child-pet.*` (удалить дубли в `ui.pet`).

### 6. ChildPageTitle API

```tsx
<ChildPageTitle
  titleKey="ui.nav.goals"
  presenterId="child-goals"
/>
```

Внутри — badge + sheet state. Опционально `presenterId` omit = без бейджа.

### 7. Двухуровневая copy-стратегия (актуализация 2026-09-01)

| Уровень | `presenterId` | Заголовок | Содержание |
|---------|---------------|-----------|------------|
| North Star | `child-home` | «KidsBank — продуктовая ценность» | Глобальная ценность: привычка, финграмотность, LTV, семья |
| Рычаг | все остальные | «{Механика} — рычаг: {угол}» | Как экран доставляет North Star; demo — экранный |

Не дублировать манифест главной на каждом sheet. Новые фичи: home обновлять только если меняется глобальная история; иначе — новый `presenterId` как рычаг.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Шум от множества ℹ️ | Muted стиль; секционные только на главной |
| Огромный locales diff | Shared `ui.presenter.close`; конфиг row ids |
| Дубли copy tasks/goals section vs page | Section sheets короче (2 demo steps) |

## Open Questions

- Нет — карта P0/P1/skip согласована с `01` и текущим scope прототипа.
