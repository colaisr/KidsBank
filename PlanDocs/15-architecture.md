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
src/data/demoBaseline.ts   # стартовое состояние сценария v5 (балансы, задания, цели с `selected`, ★, taskStats, лимит, транзакции, pet)
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
| `kidsbank.childExperience`, `kidsbank.childAgeRange` | три child UI: `young` (6–8), `youngDesigner` (8–10), `teen` (10–12+) | не сбрасывается кнопкой «Сбросить сценарий» |
| `evoca-demo-v2` (только слой 8–10) | локальное состояние handoff child; синхронизируется с `kidsbank.demo` через мост | отдельно от «Сбросить сценарий» (см. bridge) |
| `kidsbank.cardSkin` | скин карты ребёнка (`ocean` … `racing`) | «Сбросить сценарий» → `ocean` |
| `kidsbank.demo` | живое демо v5: карта, копилка (`shareSlug`), ★, `taskStats`, задания (`templateId`, `dueTime`, `customTitle`), цели (`selected`, `redeemed`), лимит карты, кошелёк родителя, `pet`, `transactions[]` (в т.ч. `cardToPiggy`, `piggyToCard`, `taskReward`) | «Сбросить сценарий» в настройках или «Оформлении» |

Компоненты читают сценарий через `DemoStateContext`; мутации — `demoActions.ts`. При отсутствии ключа — `DEMO_BASELINE`; v1–v4 мигрируют в v5 при загрузке.

Компоненты: `t('demo.tasks.homework')`, не `task.title`. Смена языка перерисовывает UI и фикстуры одним locale.

Числа/даты/валюта: locale `hy-AM` / `ru-RU` / `en-US`, валюта демо AMD (пока не решат иначе).

## 4. Структура `src/`

```text
src/
  main.tsx, App.tsx, index.css
  components/     PhoneFrame, AppHeader, RoleToggle, AppearanceButton,
                  ChildHomeHeader, ChildPageTitle, HomeSectionHeading,
                  ChildProfileCard, ChildTabBar, AccountsSection, CardSkinTile,
                  GoalCard, TaskCard, TaskStatsCards, TaskCompleteBurst,
                  PresenterInfoBadge, PresenterValueSheet, PresenterBadgeWithSheet,
                  ParentTaskRow, AddTaskModal, EditTaskModal, TaskRow,
                  TransactionRow, PiggyDepositRow, PiggyTransferModal,
                  TransferModal, LimitModal,
                  DemoSettingsPanel, DemoSettingsLink, StarsWalletCard
  designer-child/ vendor handoff Evoca Kids (8–10): HomeApp, DemoState, assets; lazy chunk + `.kb-designer-child` scope CSS
  pages/          ChildShell, ChildHomePage, DesignerChildExperience, TeenChildHomePage,
                  child-young/YoungChildHomePage, AppearanceRedirect,
                  ChildTasksPage, ChildGoalsPage, ChildPiggyBankPage,
                  ChildCardDesignPage,
                  ChildTransactionsPage,
                  ChildPetPage, ChildHubPage, ChildProfilePage,
  components/child-young/  YoungChildHomeHeader, YoungQuickActions, YoungAccountRows,
                  YoungTotemDock, YoungLionTotem
                  ParentShell, ParentHomePage, AppearancePage
  components/pet/ PetLevelBadge, PetSpeechBubble, PetCharacter, PetNeedBars,
                  PetActionButtons
  context/        PreferencesContext (bank, locale, role, cardSkin, childExperience + persistence),
                  childExperience.ts (age → young|youngDesigner|teen),
                  designer-child/kidsbankDemoBridge.ts (demo sync + `kidsbank-demo-updated`),
                  DemoStateContext (сценарий демо + reset),
                  demoActions.ts (чистые мутации состояния)
  data/           demoBaseline v5, goalCatalog.ts, taskTemplates.ts, cardSkins.ts, starEconomy.ts,
                  presenterSheets.ts, children, tasks, goals
  locales/        hy.json, ru.json, en.json, presenter.hy.json, presenter.ru.json, presenter.en.json
  i18n/           инициализация i18next
  themes/         amio.css, evoca.css, card-skins.css — CSS-токены на [data-theme] + [data-card-skin]
  lib/            format.ts, tasks.ts, goals.ts, piggy.ts, pet.ts (уровень, decay, hints, tab badge),
                  leoChatApi.ts (young totem → `/api/kidsbank/leo/chat`)
```

Роуты ребёнка: `/child` (teen | young | designer handoff по `childExperience`), `/child/profile` (единые настройки), `/child/young/*` (только `young`), `/child/onboarding/*`, остальные teen/young маршруты как в `01`. `/appearance` → `/child/profile`.

Default locale: `ru`. Ключи localStorage: `kidsbank.bank`, `kidsbank.lang`, `kidsbank.role`, `kidsbank.cardSkin`, `kidsbank.childExperience`, `kidsbank.childAgeRange`, `kidsbank.demo` (v5, включает `pet` и `goals[].selected`).

Preview: https://62-113-106-19.sslip.io/ — деплой при push в `main` (см. `16`).

## 5. Чего нет

Auth, API, Prisma, Docker runtime, микросервисы. **Исключение для показа:** на preview VPS — лёгкий proxy `deploy/leo-chat` (Polza) только для чата young-тотема; см. `16`. Остальное демо — по-прежнему статика + `localStorage`.
