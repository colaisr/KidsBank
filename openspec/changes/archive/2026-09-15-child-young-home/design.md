## Context

Surf baseline + onboarding age screen уже в проде демо. Young IA — референс `references/bank-1/amio-junior-home.png` с дельтой: в нижней полоске только тотем (без кнопок «Поиграть»/«Поговорить» на home).

## Goals / Non-Goals

**Goals:** segment switch; young home layout; totem → placeholder; teen frozen.

**Non-goals:** parent UI; quick-action flows; full young route tree.

## Decisions

### 1. Experience model

```ts
type ChildExperience = 'young' | 'teen';
experienceFromAgeRange(id): young if id in ['6-8','8-10'], else teen
```

Storage: `kidsbank.childExperience`. Default `teen` if missing.

### 2. Routing

- `/child` index: `ChildHomePage` switches on `childExperience`.
- `/child/young/totem`: placeholder (back → `/child`).
- Teen routes unchanged; young users без tab bar не получают FAB-навигацию на этом шаге.

### 3. Shell

`ChildShell`: `hideTabBar = onboarding paths OR childExperience === 'young'`.

### 4. Components

`src/pages/TeenChildHomePage.tsx` — перенос текущего `ChildHomePage` без правок логики.

`src/pages/child-young/YoungChildHomePage.tsx` + `src/components/child-young/*` — новая вёрстка; данные из `DemoStateContext` и `usePreferences` как на teen.

Quick actions: `<button type="button">` без handlers (future changes).

Totem: `Link` to `/child/young/totem`.

### 5. i18n

`ui.childYoung.home.*` в hy/ru/en.

## Risks

- **Deep link на teen routes при young** — допустимо в демо; tab bar скрыт.
- **Spec profile-onboarding** говорило «age не персистить» — delta в change обновляет требование.
