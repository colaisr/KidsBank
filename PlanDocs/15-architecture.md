# 15 — Архитектура прототипа

Статус: актуален (2026-09-01), **тонкий** документ. Не C4 и не прод-банк. Менять стек — только решением владельца.

## 1. Стек

| Слой | Выбор |
|------|--------|
| Приложение | Vite + React + TypeScript |
| Стили | Tailwind 4 + CSS-переменные `--kb-*` на `html[data-theme]`; в `index.css` — `@theme inline` (иначе темы не переключаются в рантайме) |
| i18n | `i18next` + `react-i18next` |
| Роутинг | React Router (`/child`, `/parent`, `/appearance`) |
| Данные | нет сервера, нет БД |
| Деплой | статический хостинг |

## 2. Темы и язык

```html
<html lang="ru" data-theme="amio">
```

- `data-theme`: `amio` | `evoca`
- `lang`: `hy` | `ru` | `en`
- Состояние: `localStorage` + query `?bank=&lang=`
- Независимо: Evoca+ru и AMIO+hy валидны

## 3. Где живут демо-данные

```text
src/data/demoBaseline.ts   # стартовое состояние сценария (балансы, задания, цели, ★)
src/data/                  # id сущностей и типы; тексты — только в locales
src/locales/hy.json
src/locales/ru.json
src/locales/en.json
  ui.*             # табы, кнопки, «Оформление»
  demo.*           # имена, задания, операции, реплики маскота
```

**Два слоя состояния в `localStorage`:**

| Ключ | Что хранит | Сброс |
|------|------------|--------|
| `kidsbank.bank`, `kidsbank.lang`, `kidsbank.role` | оформление показа | не сбрасывается кнопкой «Сбросить сценарий» |
| `kidsbank.demo` | живое демо: карта, копилка, баланс ★, статусы заданий, прогресс целей | «Сбросить сценарий» в «Оформлении» |

Компоненты читают сценарий через `DemoStateContext`; при отсутствии ключа — `DEMO_BASELINE`.

Компоненты: `t('demo.tasks.homework')`, не `task.title`. Смена языка перерисовывает UI и фикстуры одним locale.

Числа/даты/валюта: locale `hy-AM` / `ru-RU` / `en-US`, валюта демо AMD (пока не решат иначе).

## 4. Структура `src/` (фаза 2)

```text
src/
  main.tsx, App.tsx, index.css
  components/     PhoneFrame, AppHeader, RoleToggle, AppearanceButton,
                  ChildHomeHeader, ChildPageTitle, ChildProfileCard,
                  ChildTabBar, AccountsSection, GoalCard, TaskRow
  pages/          ChildShell (layout + Outlet), ChildHomePage,
                  ChildTasksPage, ChildGoalsPage, ChildTransactionsPage,
                  ChildPetPage, ChildHubPage, ChildProfilePage,
                  ParentShell, AppearancePage
  context/        PreferencesContext (bank, locale, role + persistence),
                  DemoStateContext (сценарий демо + reset)
  data/           demoBaseline, children, tasks, goals — ids и числа
  locales/        hy.json, ru.json, en.json
  i18n/           инициализация i18next
  themes/         amio.css, evoca.css — CSS-токены на [data-theme]
  lib/            format.ts — Intl для валюты/дат/чисел
```

Роуты ребёнка: `/child`, `/child/tasks`, `/child/goals`, `/child/transactions`, `/child/pet`, `/child/hub`, `/child/profile`.

Default locale: `ru`. Ключи localStorage: `kidsbank.bank`, `kidsbank.lang`, `kidsbank.role`, `kidsbank.demo`.

Preview: https://62-113-106-19.sslip.io/ — деплой при push в `main` (см. `16`).

## 5. Чего нет

Auth, API, Prisma, Docker runtime, микросервисы. Если задача требует сервер — это смена конституции, не «заодно».
