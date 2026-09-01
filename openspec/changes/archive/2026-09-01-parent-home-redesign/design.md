## Context

Текущее состояние `/parent`:

- `ParentShell`: `AppHeader` + отдельный gradient-блок приветствия + `ParentHomePage` без scroll-обёртки.
- `PhoneFrame` фиксирует высоту (`h-dvh`, `overflow-hidden`); у `ChildShell` есть `min-h-0 flex-1 overflow-y-auto`, у родителя — нет → контент обрезается.
- `index.css`: `.parent-quick-actions` — grid на AMIO, `flex-direction: column` на Evoca; `.parent-action-card` — разная ориентация (column vs row). Это нарушает запрос «элементы не меняются, только цвет».

См. proposal.md — Why. Surf baseline (`01`): те же секции и действия; дельта — отказ от bank-specific layout в пользу единой раскладки + полировка.

## Goals / Non-Goals

**Goals:**

- Починить scroll (приоритет P0).
- Единый dashboard layout для AMIO/Evoca; тема = токены.
- Визуал «взрослого банка» по `17`: воздух, карточки, один primary, без детскости.
- Сохранить все секции, модалки, presenter `parent-home`.

**Non-Goals:**

- Новые фичи, табы, роуты.
- Изменение `demoActions`, модалок, i18n-ключей (кроме правок при необходимости).
- Перенос родителя на `ChildShell`/Outlet-архитектуру.

## Decisions

### 1. Scroll shell (как у ребёнка)

`ParentShell` → структура:

```text
div.kb-parent-shell (flex min-h-0 flex-1 flex-col bg-surface-muted)
  AppHeader (shrink-0, border-b)
  div.min-h-0 flex-1 overflow-y-auto
    ParentHomePage (весь контент, включая hero)
```

Hero-gradient и приветствие **внутри** scroll area (не sticky) — проще, меньше конфликтов с safe-area. `AppHeader` остаётся снаружи scroll — всегда виден.

**Альтернатива:** sticky hero — отклонена: лишняя сложность для демо, мало выигрыша.

### 2. Единая сетка quick actions (2×2)

Удалить из `index.css` все `html[data-theme='evoca']` overrides для `.parent-quick-actions` и `.parent-action-card`.

Перенести стили в Tailwind на `ParentHomePage`:

```text
grid grid-cols-2 gap-3
```

Каждая карточка: `flex flex-col items-start rounded-card border border-border bg-surface p-4` + hover `border-primary/40`. Иконка-emoji остаётся (демо-прототип); цвет текста — `text-text` / `text-text-muted`.

Карточка «Лимит» с двумя строками: `flex flex-col` + `min-w-0` для подписи — одинаково на обеих темах.

**Альтернатива:** горизонтальные feed-карточки Evoca — отклонена по запросу владельца.

### 3. Hero + balance (designer)

Объединить gradient-блок из `ParentShell` и balance-card из `ParentHomePage` в **единый hero**:

```text
[gradient bg var(--kb-header-gradient)]
  greeting (ui.shell.parentGreeting)
  subtitle (ui.parent.subtitle)
  balance card (полупрозрачный white/10 или surface overlay)
    childBalance label + AMD amount
    piggyBalance subtitle
```

Balance уходит из отдельной белой карточки в hero — меньше визуального шума, ближе к adult mobile banking. Цифры: `font-heading text-3xl` на балансе карты.

Контентная зона ниже hero: `px-4 pb-8 pt-5 space-y-6 bg-surface-muted`.

### 4. Section headings

Вынести повторяющийся `<h2>` в локальный `ParentSectionHeading` (или inline pattern): `font-heading text-base font-semibold text-text mb-3`. Без presenter ℹ️ на секциях (как сейчас) — экранный sheet достаточен.

### 5. Row components — лёгкая полировка

`ParentTaskRow` / `ParentGoalRow`: оставить структуру; уточнить отступы (`gap-2` кнопок), `active:scale-[0.98]` на primary confirm (опционально, 200ms). Кнопка «Отменить» — `border-destructive/30 text-destructive` через токен, если есть; иначе оставить red utilities (не theme-specific).

`TransactionRow` — без изменений, если вписывается в секцию.

### 6. Theme tokens only

Никаких `html[data-theme]` в parent CSS. Все цвета: `primary`, `surface`, `border`, `text`, `text-muted`, `var(--kb-header-gradient)`. Проверить AMIO и Evoca после удаления overrides.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Отход от `17-theme-bank-2` «feed у родителя» | Явная дельта в proposal + `01`; владелец запросил единую раскладку |
| Hero merge ломает визуальный якорь balance | Проверить контраст white-on-gradient на обеих темах |
| Длинные армянские подписи в 2×2 grid | `text-sm`, `min-w-0`, `line-clamp-2` на подзаголовках quick actions |
| Регрессия модалок | Модалки вне scroll-shell — не трогаем порталы |

## Migration Plan

Только фронт. Без миграции `localStorage`. После merge — visual QA на preview: scroll, обе темы, hy.

## Open Questions

- Нет.
