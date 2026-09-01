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

Детали: [`PlanDocs/00-product-overview.md`](PlanDocs/00-product-overview.md). Конкуренты: [`PlanDocs/02-competitive-landscape.md`](PlanDocs/02-competitive-landscape.md). План работ: [`PlanDocs/19-work-plan.md`](PlanDocs/19-work-plan.md).

## 2. Стек прототипа

Vite + React + TypeScript + Tailwind. Темы: `data-theme=amio|evoca` (токены в CSS, Tailwind `@theme inline`). Локали: i18next, `hy|ru|en`, default `ru`. Демо-сущности по id в `src/data/`, строки в `src/locales/`. Состояние показа: `localStorage` + `?bank=&lang=`. Без сервера и БД. Деплой — статика на VPS.

Норматив: [`PlanDocs/15-architecture.md`](PlanDocs/15-architecture.md).

**Текущее состояние (2026-09-01):** фаза 1 закрыта (оболочка демо). Очередь — **фаза 2** (главная ребёнка). Preview: https://62-113-106-19.sslip.io/

## 3. Команды

```bash
npx openspec doctor          # спек-процесс
npx openspec list
# изменения: /opsx:propose | apply | explore | archive | sync
npm run dev                  # локально
npm run build                # прод-сборка
# push в main → GitHub Actions деплоит на preview VPS (см. 16)
```

Роли Cursor: `/product` `/designer` `/developer` `/devops` и `/opsx:*`.

## 4. Карта знаний

| Вопрос | Где |
|--------|-----|
| Индекс PlanDocs | [`PlanDocs/README.md`](PlanDocs/README.md) |
| Конституция, аудитория показа | [`PlanDocs/00-product-overview.md`](PlanDocs/00-product-overview.md) |
| Блоки Surf / демо-сценарии | [`PlanDocs/01-surf-baseline.md`](PlanDocs/01-surf-baseline.md) |
| Конкуренты, кто с kids-приложением | [`PlanDocs/02-competitive-landscape.md`](PlanDocs/02-competitive-landscape.md) |
| Откуда какой референс | [`PlanDocs/references/README.md`](PlanDocs/references/README.md) |
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

1. **product** — ценность, non-goals, acceptance, сверка с [`02`](PlanDocs/02-competitive-landscape.md); дельта от Surf только явно.
2. **designer** — UI по `17` + теме банка; три языка; не впритык под русский.
3. `/opsx:propose` → proposal + design + tasks (в tasks — пункт обновить затронутые PlanDocs).
4. Утверждение владельцем.
5. `/opsx:apply` (**developer**) строго по tasks.
6. **devops** — preview-хост и CI уже есть (`16`); менять инфраструктуру только по задаче.
7. **Feedback loop (обязателен):** PlanDocs выровнять под то, что реально добавили (игра → `01`/`19`, новый референс → `02` + `references/README.md`). Затем `/opsx:archive` (влить delta specs). Архив **без** этой правки — нарушение процесса.

Мелочь (опечатка, однострочный баг без продуктовой двусмысленности) — без полного change, с acceptance и инвариантами.

Класс задачи и очередь фаз — [`PlanDocs/19-work-plan.md`](PlanDocs/19-work-plan.md).
