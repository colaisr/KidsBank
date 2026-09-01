# KidsBank — контекст для AI-агентов

Единая точка входа. Этот репозиторий — **расходный прототип** детского банкинга для показа инвестору и банкам. Если проект утвердят, его соберут заново. Не строить прод-банк в этом коде.

## 1. Конституция (читать всегда)

**KidsBank** — мобильный веб-прототип семейного / детского банкинга. Открывается на телефоне, выглядит как приложение. Цель показа: «как будто работа в приложении» — красота, плавность, живые демо-сценарии.

Продуктовая база — концепт [Surf «Детский банкинг»](https://surf.ru/bank-for-kids/). Сначала воссоздаём его как минимум. Отклонения — только явным OpenSpec change. Не взрослое ДБО в детской шкурке.

Два кабинета в одной кодовой базе: **ребёнок** и **родитель**. Две темы банков: **AMIO** и **Evoca**. Три языка с первого дня: **hy / ru / en** — UI и демо-данные из одних локалей, синхронно.

Незыблемо:

- Нет настоящего бэкенда, KYC, платёжного шлюза, боевых карт.
- Экраны одни; банк = CSS-тема, не форк вёрстки.
- Пользовательские строки не хардкодить: только ключи i18n (`ui.*`, `demo.*`).
- Секреты не коммитить.

Детали: [`PlanDocs/00-product-overview.md`](PlanDocs/00-product-overview.md). План работ: [`PlanDocs/19-work-plan.md`](PlanDocs/19-work-plan.md).

## 2. Стек прототипа

Vite + React + TypeScript + Tailwind. Темы: `data-theme=amio|evoca`. Локали: i18next, `hy|ru|en`. Демо-сущности по id в `src/data/`, строки в `src/locales/`. Состояние показа: `localStorage` + `?bank=&lang=`. Без сервера и БД. Деплой — статика.

Норматив: [`PlanDocs/15-architecture.md`](PlanDocs/15-architecture.md).

## 3. Команды

```bash
npx openspec doctor          # спек-процесс
npx openspec list
# изменения: /opsx:propose | apply | explore | archive | sync
# после появления приложения:
npm run dev
```

Роли Cursor: `/product` `/designer` `/developer` `/devops` и `/opsx:*`.

## 4. Карта знаний

| Вопрос | Где |
|--------|-----|
| Индекс PlanDocs | [`PlanDocs/README.md`](PlanDocs/README.md) |
| Конституция, аудитория показа | [`PlanDocs/00-product-overview.md`](PlanDocs/00-product-overview.md) |
| Блоки Surf / демо-сценарии | [`PlanDocs/01-surf-baseline.md`](PlanDocs/01-surf-baseline.md) |
| Стек, i18n, демо-данные | [`PlanDocs/15-architecture.md`](PlanDocs/15-architecture.md) |
| Деплой | [`PlanDocs/16-ops-deploy.md`](PlanDocs/16-ops-deploy.md) |
| UI-принципы, свитчер «Оформление» | [`PlanDocs/17-design-guidelines.md`](PlanDocs/17-design-guidelines.md) |
| Тема AMIO | [`PlanDocs/17-theme-bank-1.md`](PlanDocs/17-theme-bank-1.md) |
| Тема Evoca | [`PlanDocs/17-theme-bank-2.md`](PlanDocs/17-theme-bank-2.md) |
| **План работ (фазы)** | [`PlanDocs/19-work-plan.md`](PlanDocs/19-work-plan.md) |
| Что нельзя ломать | [`docs/INVARIANTS.md`](docs/INVARIANTS.md) |
| Открытые вопросы | [`docs/OPEN-QUESTIONS.md`](docs/OPEN-QUESTIONS.md) |
| Роли | [`docs/roles/`](docs/roles/) |
| Живые спеки / changes | `openspec/` |

## 5. Процесс

1. **product** — ценность, non-goals, acceptance; дельта от Surf только явно.
2. **designer** — UI по `17` + теме банка; три языка; не впритык под русский.
3. `/opsx:propose` → proposal + design + tasks.
4. Утверждение владельцем.
5. `/opsx:apply` (**developer**) строго по tasks.
6. **devops** — только если нужен публичный URL.
7. `/opsx:archive`.

Мелочь (опечатка, однострочный баг без продуктовой двусмысленности) — без полного change, с acceptance и инвариантами.

Класс задачи и очередь фаз — [`PlanDocs/19-work-plan.md`](PlanDocs/19-work-plan.md).
