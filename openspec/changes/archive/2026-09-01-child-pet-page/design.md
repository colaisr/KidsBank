## Context

Фазы 1–3: экономика ★ (задания → кошелёк → цели → AMD). Питомец — дельта от Surf: engagement + **финансовая метафора**, не отдельная игра. EvocaTEENZ тамагочи публично не имеет.

**Продуктовая формула питомца:**

```text
retention (заходить чаще)
+ financial loop (заработал → потратил → выбрал цель)
+ habit bridge (задание родителя → бонус питомцу)
= ценность для ребёнка и банка
```

## Goals / Non-Goals

**Goals:**

- Макет `amio-junior-pet.png` + тамагочи за 90 с.
- Уход **стоит** ★; ★ только из заданий.
- `taskBuff` после confirmTask; пузырь-навигатор на tasks/goals.
- Презентерский ℹ️-sheet с таблицей ценности.
- PlanDocs `01` описывает продуктовую логику.

**Non-goals:**

- Маскот-чат, B2/B3, родительский UI, начисление ★ с питомца, push.

## Decisions

### 1. Pet data model

```ts
type PetState = {
  xp: number;
  fullness: number;     // 0–100
  joy: number;
  energy: number;
  careCount: number;
  visitCount: number;
  taskBuff: boolean;    // one free care action after parent confirms task
  lastTickAt: string;
};
```

Имя — i18n `demo.pet.name`. Уровень = `floor(xp / 10) + 1`. Version bump → 4.

### 2. Level formula (демо-ускорение)

```ts
const XP_PER_LEVEL = 10;
function petLevel(xp: number) { return Math.floor(xp / XP_PER_LEVEL) + 1; }
// baseline xp=25 → level 3; +10 xp за действие → level 4
```

Плашка `ui.pet.levelUp` обязательна.

### 3. Decay (90 с, без ожидания)

**Revisit** (`visitCount > 0`): fullness −12, joy −10, energy −15.

**Time** (первый визит, ≥1 мин): −3/мин, cap −12.

Первый визит после сброса: без decay.

### 4. Care actions — **стоимость ★**, не награда

Кнопки показывают **цену** (`5 ★`), без знака «+» — визуально близко к макету, семантика «трата».

| Action | Стоимость ★ | fullness | joy | energy | xp |
|--------|-------------|----------|-----|--------|-----|
| feed   | 5           | +35      | +5  | −8     | +10 |
| play   | 8           | −8       | +35 | −20    | +10 |
| sleep  | 3           | −5       | +8  | +40    | +10 |

Apply: `starsBalance -= cost` (0 если `taskBuff`, затем `taskBuff = false`), clamp needs, `xp += 10`, `careCount++`.

**Недостаточно ★:** кнопка `disabled`, `aria-disabled`, пузырь `earnStars` (тап → `/child/tasks`).

### 5. Task buff (мост B4 → питомец)

В `confirmTask` (`demoActions.ts`): `pet.taskBuff = true`.

Пока `taskBuff`: следующее действие ухода **бесплатно** (0 ★), пузырь `thanksForTask`. После применения — `taskBuff = false`.

Демо-скрипт: родитель подтверждает задание → ребёнок идёт к питомцу → бесплатный корм → narrative «задания кормят питомца».

### 6. Speech bubble — состояние + навигатор

Приоритет (первая сработавшая):

| Условие | hint key | Действие по тапу |
|---------|----------|------------------|
| `careCount === 0` | `feedMe` | — |
| `taskBuff` | `thanksForTask` | — |
| `starsBalance < 5` | `earnStars` | → `/child/tasks` |
| `fullness < 40` | `feedMe` | — |
| `energy < 40` | `sleepy` | — |
| `joy < 40` | `playWithMe` | — |
| все ≥ 70% | `checkGoals` | → `/child/goals` |
| иначе | `happy` | — |

Красная точка: `min(needs) < 40` или `starsBalance < minCost`.

`PetSpeechBubble`: если hint navigable — `role="button"`, chevron ›.

### 7. Baseline

```ts
pet: {
  xp: 25,
  fullness: 80, joy: 65, energy: 40,
  careCount: 0, visitCount: 0,
  taskBuff: false,
  lastTickAt: ISO now,
}
starsBalance: 860  // хватает на демо
```

### 8. UI layout

1. `ChildPageTitle`
2. **Row:** `PetLevelBadge` + **PresenterInfoBadge** (маленький ℹ️, `opacity-50`, 20×20, справа от бейджа уровня)
3. `PetSpeechBubble`
4. `PetCharacter`
5. `PetNeedBars`
6. `PetActionButtons` — cost label, disabled state

### 9. Presenter info badge (замаскированный)

**`PresenterInfoBadge`** + **`PetPresenterSheet`** (bottom sheet):

- Внешне: круг 20px, иконка `ⓘ` или `i` в тоне `text-muted`, как «подсказка об уровне» — не баннер.
- `aria-label`: `ui.pet.presenter.open` («О питомце» / нейтрально).
- Тап → sheet с тремя блоками (таблицы/markdown-стиль):

**Блок A — ценность для ребёнка** (`ui.pet.presenter.child.*`):

| Тема | Смысл |
|------|-------|
| Регулярность | Заходить каждый день |
| Заработал → потратил | ★ из заданий на уход |
| Выбор | Питомец vs цель |
| Ответственность | Питомец грустит, если забыл |

**Блок B — ценность для банка** (`ui.pet.presenter.bank.*`):

| Эффект | Смысл |
|--------|-------|
| Retention | DAU, привычка к бренду |
| Ранний LTV | С 8–12 лет, не с 18 |
| Дифференциация | Не взрослое ДБО |
| Семья | Родитель видит вовлечённость |

**Блок C — сценарий 90 с** (`ui.pet.presenter.demo.*`): шаги из §10.

Закрытие: тап вне / «Понятно». Только на `/child/pet`.

### 10. Stars economy (обновлённая модель)

```text
Задания (B4) ──confirm──► ★ на баланс
                              │
                              ├─► Уход за питомцем (−3…8 ★) → XP / уровень
                              └─► Цели (+50 ★) → AMD на карту
```

Питомец **не** источник ★. `taskStats` не меняется от питомца.

### 11. Сценарий показа (~90 с)

| Шаг | Действие | Narrative |
|-----|----------|-----------|
| 0 | (опц.) Тап ℹ️ | Инвестору — таблица ценности |
| 1 | Открыть «Питомец» | Уровень 3, «Покорми меня!» |
| 2 | **Покормить** (−5 ★) | Level 4, «звёзды — как корм» |
| 3 | Главная → Питомец | Revisit decay, снова просит |
| 4 | Родитель подтверждает задание | taskBuff |
| 5 | **Покормить** бесплатно | «Задания кормят Кекса» |
| 6 | Пузырь → **Цели** | «Не забудь велосипед» |

### 12. Relation to mascot (B5)

Питомец = эмоция + привычка; маскот (фаза 4) = термины. Разные сущности.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Макет с «+5★» vs трата | Без плюса на кнопке; в presenter sheet объяснено |
| Мало ★ после спама | Baseline 860; costs малы |
| ℹ️ заметен клиенту | Мелкий, muted; можно не упоминать на показе |
| confirmTask в другой роли | taskBuff в state, виден после switch role |

## Migration Plan

`DEMO_STATE_VERSION` 3→4. Archive: specs, `01`, `00`, `references`, `19`.

## Open Questions

- Нет.
