## Context

Фаза 1: пустой `ChildShell`, `AppHeader`, роуты. **Источник правды UI:** макет AMIO Junior (`references/bank-1/amio-junior-home.png`). Surf — сценарии, не пиксель-в-пиксель.

## Goals / Non-Goals

**Goals:**

- Junior IA и раскладка главной; одна вёрстка, две темы.
- Демо-состояние в `kidsbank.demo` + сброс в «Оформлении».
- Звёзды и прогресс целей **отображаются**; механика — фаза 3.

**Non-Goals:**

- Интерактивное начисление/списание ★.
- Наполнение родителя, маскот, игра.

## Decisions

### 1. Junior home layout

- `ChildHomeHeader`: «Главный», звезда, чат (заглушка).
- `ChildProfileCard` → `/child/profile` (роль, «Оформление»).
- `AccountsSection`: «Счета», карта продукта, копилка AMD, звёзды.
- Задания → Цели (порядок как на макете); награды и цели в ★.

### 2. Bottom navigation (Junior IA)

| Tab | Route |
|-----|-------|
| Главная | `/child` |
| Цели | `/child/goals` |
| FAB (сетка) | `/child/hub` |
| Транзакции | `/child/transactions` (заглушка) |
| Питомец | `/child/pet` (заглушка) |

Задания и профиль — с главной («Все» / карточка профиля), не отдельные табы.

### 3. Demo state

```text
src/data/demoBaseline.ts     # DEMO_BASELINE — стартовые значения
src/context/demoState.ts     # read/write/reset kidsbank.demo
src/context/DemoStateContext.tsx
```

Сброс: `clearDemoStateStorage()` + `cloneDemoBaseline()`. Не трогает `kidsbank.bank|lang|role`.

### 4. Star economy (display only)

- `starsBalance` — кошелёк ★ на главной.
- `goal.currentStars` / `targetStars` — прогресс цели.
- Начисление за задание и перенос на цель — фаза 3 (документировано в `01`).

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Демо накрутили во время показа | «Сбросить сценарий» в «Оформлении» |
| Чат/транзакции/питомец пустые | Заглушки + фазы 3–5 в плане |

## Migration Plan

Только фронт. Archive change → фаза 2 закрыта в `19`.
