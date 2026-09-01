## Context

Репозиторий после фазы 0: PlanDocs и OpenSpec готовы, `src/` отсутствует. Мотивация — см. `proposal.md`. Архитектурные ограничения: [`PlanDocs/15-architecture.md`](../../../PlanDocs/15-architecture.md), инварианты [`docs/INVARIANTS.md`](../../../docs/INVARIANTS.md). Требования — delta-спеки в `specs/`.

## Goals / Non-Goals

**Goals:**

- Минимальный, но визуально убедительный каркас: phone frame, две темы, три языка, два шелла, экран «Оформление».
- Единый источник правды для bank/locale/role через React context + синхронизация с `localStorage` и URL.
- Заложить структуру каталогов для фаз 2–5 без переписывания.

**Non-Goals:**

- Контент Surf (карта, копилка, табы) — фаза 2.
- Evoca Dark, анимации экранов Surf, маскот.
- Тестовый фреймворк (можно добавить позже; валидация — ручной смоук по acceptance).

## Decisions

### 1. Vite + React 18 + TypeScript + Tailwind 4

**Выбор:** стандартный стек из `15-architecture.md`.

**Альтернативы:** Next.js (избыточен для статики), CRA (устарел).

**Структура `src/`:**

```text
src/
  main.tsx
  App.tsx
  index.css              # Tailwind + theme CSS variables
  components/
    PhoneFrame.tsx       # centered frame on desktop
    AppHeader.tsx        # title + appearance link + role toggle
  pages/
    ChildShell.tsx
    ParentShell.tsx
    AppearancePage.tsx
  context/
    PreferencesContext.tsx  # bank, locale, role + persistence
  data/
    children.ts          # { id: 'child.david', ... } — no text
  locales/
    hy.json | ru.json | en.json
  i18n/
    index.ts             # i18next init
  themes/
    amio.css | evoca.css # token definitions on [data-theme]
```

### 2. React Router для навигации

**Выбор:** `react-router-dom` v6 с маршрутами `/child`, `/parent`, `/appearance`.

**Почему:** «Оформление» — полноценный экран с back; роуты упрощают deep-link и фазу 2 (добавление табов).

**Поведение:** при смене роли — `navigate` на соответствующий маршрут; bank/lang не меняют маршрут.

### 3. PreferencesContext — единый слой состояния

**Выбор:** один React context хранит `bank`, `locale`, `role`.

**Инициализация (порядок приоритета):**

1. Валидные `?bank=&lang=` из URL
2. `localStorage` (`kidsbank.bank`, `kidsbank.lang`, `kidsbank.role`)
3. Defaults: `amio`, `ru`, `child`

**При изменении:** обновить state → `document.documentElement` (`data-theme`, `lang`) → i18n `changeLanguage` → `localStorage` → `history.replaceState` для query.

**Альтернатива:** Zustand — отклонена как лишняя зависимость на фазе 1.

### 4. Темы через CSS custom properties

**Выбор:** в `index.css` базовые переменные; `[data-theme="amio"]` и `[data-theme="evoca"]` переопределяют токены (`--color-primary`, `--color-accent-kids`, `--color-surface`, `--font-heading`, …).

**Tailwind:** `theme.extend.colors` маппится на `var(--color-*)` — один класс `bg-primary` для обеих тем.

**Токены (сокращённо):**

| Token | AMIO | Evoca |
|-------|------|-------|
| primary | `#05A9C7` cerulean | `#6400DC` violet |
| primary-dark | `#086F83` atoll | `#8448FF` |
| accent-kids | `#F6AD55` casablanca | `#C4FF00` lime |
| surface | white / warm off-white | `#F4EAF6` lilac (child) |
| radius-card | 20–32px | 16–24px |

Полные значения — в theme-файлах PlanDocs `17-theme-bank-*`.

**Переход темы:** CSS `transition` на color/background 200–300ms; не unmount дерева.

### 5. i18next + JSON catalogs

**Выбор:** `i18next` + `react-i18next`, файлы `src/locales/{hy,ru,en}.json`.

**Ключи фазы 1 (минимум):**

- `ui.app.*` — общие (название, назад)
- `ui.appearance.*` — экран оформления
- `ui.role.*` — переключатель и заголовки шеллов
- `ui.shell.*` — placeholder-тексты
- `demo.child.david.name` — имя ребёнка на трёх языках

**Демо-данные:** `src/data/children.ts` → `{ id: 'child.david' }`; компонент: `t(\`demo.${child.id}.name\`)`.

**Форматирование:** заложить helper `formatCurrency` с `Intl` и locale map (`hy-AM`, `ru-RU`, `en-US`) — пока не используется на UI, но файл создать для фазы 2.

### 6. Шрифты

**Выбор:** Google Fonts через `@fontsource` или link в `index.html`:

- **Базовый UI:** Noto Sans + Noto Sans Armenian (покрытие hy/ru/en без лицензионных сюрпризов).
- **Evoca heading (опционально на фазе 1):** Montserrat для заголовков через `--font-heading`; Nomixa — если доступен как webfont, иначе fallback на Montserrat/Inter.

**dir:** `ltr` для всех трёх языков (по `17-design-guidelines`).

### 7. UI компоненты фазы 1

**PhoneFrame:** max-width ~390px, min-height 100dvh, тень на desktop.

**AppHeader:** localized title, кнопка «Оформление» (palette icon), segmented control child|parent.

**AppearancePage:** две секции — Bank (radio cards AMIO/Evoca с цветовым swatch) и Language (три кнопки). Текущий выбор визуально highlighted primary token.

**Shells:** gradient header strip (theme token), greeting с `demo.child.david.name`, muted empty-state `ui.shell.empty`.

Никакого отдельного demo HUD вне приложения.

### 8. package.json scripts

```json
"dev": "vite",
"build": "tsc -b && vite build",
"preview": "vite preview"
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Noto вместо Nomixa для Evoca — менее «брендово» | Достаточно для фазы 1; уточнить webfont Nomixa в фазе 2 |
| Flash при первой загрузке до применения темы | Inline script в `index.html` читает localStorage/query до React hydrate |
| Длинные армянские строки ломают layout | `min-w-0`, переносы, тест на ~360px в validation task |
| Дублирование логики URL/localStorage | Вся логика только в `PreferencesContext` |

## Migration Plan

Новое приложение с нуля — миграции нет. После merge:

1. `npm install`
2. `npm run dev` — локальная проверка
3. `npm run build` — CI/деплой в фазе 6

Rollback: удалить `src/` и вернуть package.json к openspec-only (не ожидается).

## Open Questions

- Точный default locale: предлагаем `ru` (аудитория показа); можно сменить на `hy` по решению владельца до apply.
- Nomixa webfont: отложено; Montserrat/Noto на фазе 1.
