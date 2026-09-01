## Context

Фазы 1–3: переключатель роли (`RoleToggle`) в `/child/profile` и настройках презентера. Карточка Давида сейчас только отображает имя — не кликабельна для онбординга. Нужны два полноэкранных шага по макетам пользователя для сценария показа; в будущем тот же флоу может стать реальным онбордингом.

See `proposal.md` — Why.

## Goals / Non-Goals

**Goals:**

- Кликабельная карточка ребёнка на `/child/profile` → `/child/onboarding/role`.
- Экран роли: логотип банка, иллюстрация (ракета — CSS/SVG или существующий asset), две карточки, footer tagline.
- Экран возраста: back, progress (шаг 2 из 2), 5 radio-карточек, CTA «Продолжить».
- Родитель → `navigate('/parent')` + установка role preference (как `RoleToggle`).
- Ребёнок → `/child/onboarding/age`; Continue → `/child`.
- Локальный `useState` для выбранного возраста; без записи в demo state.
- Скрыть `ChildTabBar` на маршрутах онбординга (outlet вне tab shell или conditional в `ChildShell`).
- i18n `ui.onboarding.role.*`, `ui.onboarding.age.*` в hy/ru/en.
- Экран возраста: `ChildPageTitle` с `presenterId="onboarding-age"` (тот же `PresenterBadgeWithSheet` + `PresenterValueSheet` паттерн).
- `onboarding-age` в `PRESENTER_SHEET_IDS` + copy в `presenter.{hy,ru,en}.json` (персонализация, Junior vs TEENZ в будущем, сценарий показа из профиля).

**Non-goals:**

- Presenter sheet на экране выбора роли (шаг 1).
- Персистентность возраста, ветвление Junior/TEENZ, смена заданий.
- Онбординг при первом открытии приложения (только вход из профиля).

## Decisions

### 1. Routes

```
/child/onboarding/role   → OnboardingRolePage
/child/onboarding/age    → OnboardingAgePage
```

Вложены в `ChildShell` с условием `hideTabBar` когда `pathname.startsWith('/child/onboarding')` — аналог других full-screen child routes если уже есть паттерн; иначе отдельный wrapper `OnboardingLayout` без `ChildTabBar`.

**Альтернатива:** routes вне `ChildShell` — отклонено: нужны те же theme/locale providers и узкая колонка.

### 2. Navigation from profile

`ChildProfilePage`: обернуть article с Давидом в `button` или `Link` to `/child/onboarding/role` с `state: { from: '/child/profile' }` для возможного back (age screen back → role, role back → profile через header).

На role screen: back → `/child/profile`.

### 3. Parent navigation

Использовать существующий механизм смены роли из `PreferencesContext` / `RoleToggle` (вызов `setRole('parent')` + `navigate('/parent')`) — не дублировать логику.

### 4. Age selection state

```ts
type AgeRangeId = '6-8' | '8-10' | '10-12' | '12-14' | '14-17';
```

`useState<AgeRangeId>('10-12')` на `OnboardingAgePage` — default совпадает с макетом (выбран 10–12). Не экспортировать в context.

Continue: `navigate('/child')` only.

### 5. Visual layout

- Role page: centered column, `bg-surface-muted` / gradient как макет, parent card `bg-primary`, child card kids-accent (orange gradient token).
- Age page: header через `ChildPageTitle` с `presenterId="onboarding-age"`, `showSettingsLink={false}`; progress bars (шаг 1 muted, шаг 2 gradient), список карточек с `border-primary` при selected.
- Rocket illustration: inline SVG или простой CSS — без тяжёлых новых assets; Evoca использует те же компоненты с theme tokens.

### 6. Bank logo text

«AMIOKids» / Evoca equivalent: `ui.onboarding.role.logo` с частями или один ключ + theme-aware styling через CSS (AMIO navy + cyan «Kids»). Evoca: violet + accent по `17-theme-bank-2`.

## Risks / Trade-offs

- **[Risk] Два способа попасть в parent** (`RoleToggle` vs onboarding) → **Mitigation:** один `setRole('parent')` helper.
- **[Risk] Пользователь ожидает, что возраст сохранится** → **Mitigation:** только демо-флоу; в proposal/PlanDocs явно «пока не влияет».
- **[Trade-off] Нет auto-onboarding на старте** → ок для текущей задачи; вход только из профиля.

## Migration Plan

Чистое добавление маршрутов и страниц. Rollback: удалить routes и страницы, убрать link с карточки профиля.
