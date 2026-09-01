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
src/data/demoBaseline.ts   # стартовое состояние сценария v3 (балансы, задания, цели, ★, taskStats, лимит, транзакции)
src/data/taskTemplates.ts  # каталог шаблонов поручений + id «other»
src/data/starEconomy.ts      # шаг распределения ★ (STAR_ALLOCATE_STEP)
src/data/                  # id сущностей и типы; тексты — только в locales
src/locales/hy.json
src/locales/ru.json
src/locales/en.json
  ui.*             # табы, кнопки, «Оформление», модалки
  demo.*           # имена, задания, операции, реплики маскота
```

**Два слоя состояния в `localStorage`:**

| Ключ | Что хранит | Сброс |
|------|------------|--------|
| `kidsbank.bank`, `kidsbank.lang`, `kidsbank.role` | оформление показа | не сбрасывается кнопкой «Сбросить сценарий» |
| `kidsbank.cardSkin` | скин карты ребёнка (`ocean` … `racing`) | «Сбросить сценарий» → `ocean` |
| `kidsbank.demo` | живое демо v3: карта, копилка (`shareSlug`), ★, `taskStats`, задания (`templateId`, `dueTime`, `customTitle`), цели, лимит карты, кошелёк родителя, `transactions[]` (в т.ч. `cardToPiggy`, `piggyToCard`) | «Сбросить сценарий» в настройках или «Оформлении» |

Компоненты читают сценарий через `DemoStateContext`; мутации — `demoActions.ts`. При отсутствии ключа — `DEMO_BASELINE`; v1/v2 мигрируют в v3 при загрузке.

Компоненты: `t('demo.tasks.homework')`, не `task.title`. Смена языка перерисовывает UI и фикстуры одним locale.

Числа/даты/валюта: locale `hy-AM` / `ru-RU` / `en-US`, валюта демо AMD (пока не решат иначе).

## 4. Структура `src/` (фаза 3)

```text
src/
  main.tsx, App.tsx, index.css
  components/     PhoneFrame, AppHeader, RoleToggle, AppearanceButton,
                  ChildHomeHeader, ChildPageTitle, ChildProfileCard,
                  ChildTabBar, AccountsSection, CardSkinTile, GoalCard, TaskCard, TaskStatsCards,
                  TaskCompleteBurst, ParentTaskRow, AddTaskModal, EditTaskModal, TaskRow,
                  TransactionRow, PiggyDepositRow, PiggyTransferModal,
                  TransferModal, LimitModal,
                  DemoSettingsPanel, DemoSettingsLink, StarsWalletCard
  pages/          ChildShell (layout + Outlet), ChildHomePage,
                  ChildTasksPage, ChildGoalsPage, ChildPiggyBankPage,
                  ChildCardDesignPage,
                  ChildTransactionsPage,
                  ChildPetPage, ChildHubPage, ChildProfilePage,
                  ParentShell, ParentHomePage, AppearancePage
  context/        PreferencesContext (bank, locale, role, cardSkin + persistence),
                  DemoStateContext (сценарий демо + reset),
                  demoActions.ts (чистые мутации состояния)
  data/           demoBaseline v3, taskTemplates.ts, cardSkins.ts, starEconomy.ts, children, tasks, goals
  locales/        hy.json, ru.json, en.json
  i18n/           инициализация i18next
  themes/         amio.css, evoca.css, card-skins.css — CSS-токены на [data-theme] + [data-card-skin]
  lib/            format.ts, tasks.ts (сортировка/заголовки), piggy.ts — demo share URL
```

Роуты ребёнка: `/child`, `/child/tasks`, `/child/goals`, `/child/piggy`, `/child/card-design`, `/child/transactions`, `/child/pet`, `/child/hub`, `/child/profile`.

Default locale: `ru`. Ключи localStorage: `kidsbank.bank`, `kidsbank.lang`, `kidsbank.role`, `kidsbank.cardSkin`, `kidsbank.demo` (v3).

Preview: https://62-113-106-19.sslip.io/ — деплой при push в `main` (см. `16`).

## 5. Чего нет

Auth, API, Prisma, Docker runtime, микросервисы. Если задача требует сервер — это смена конституции, не «заодно».
