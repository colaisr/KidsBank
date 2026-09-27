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

Детали: [`PlanDocs/00-product-overview.md`](PlanDocs/00-product-overview.md). Реализованные сценарии: [`PlanDocs/01-surf-baseline.md`](PlanDocs/01-surf-baseline.md). Конкуренты: [`PlanDocs/02-competitive-landscape.md`](PlanDocs/02-competitive-landscape.md).

## 2. Стек прототипа

Vite + React + TypeScript + Tailwind. Темы: `data-theme=amio|evoca` (токены в CSS, Tailwind `@theme inline`). Локали: i18next, `hy|ru|en`, default `ru`. Демо-сущности по id в `src/data/`, строки в `src/locales/`. Состояние показа: `localStorage` + `?bank=&lang=`. Без сервера и БД. Деплой — статика на VPS.

Норматив: [`PlanDocs/15-architecture.md`](PlanDocs/15-architecture.md).

**Статус (2026-09-02): демо сдано.** Прототип готов к показу; ждёт утверждения или следующих шагов. Реализовано: оболочка (темы, i18n, кабинеты), главная ребёнка, копилка, дизайн карты, задания/цели, транзакции (фильтры, AMD+★), питомец, кабинет родителя, демо-онбординг, presenter sheets. Preview: https://62-113-106-19.sslip.io/

## 3. Команды

```bash
npx openspec doctor          # спек-процесс
npx openspec list
# изменения: /opsx:propose | apply | explore | archive | sync
npm run dev                  # локально
npm run build                # прод-сборка
# деплой preview вручную: npm run deploy:preview (см. 16); push в main не деплоит
```

Роли Cursor: `/product` `/designer` `/developer` `/devops` и `/opsx:*`.

## 4. Карта знаний

| Вопрос | Где |
|--------|-----|
| Индекс PlanDocs | [`PlanDocs/README.md`](PlanDocs/README.md) |
| Конституция, аудитория показа | [`PlanDocs/00-product-overview.md`](PlanDocs/00-product-overview.md) |
| Блоки Surf / что в демо | [`PlanDocs/01-surf-baseline.md`](PlanDocs/01-surf-baseline.md) |
| Конкуренты, кто с kids-приложением | [`PlanDocs/02-competitive-landscape.md`](PlanDocs/02-competitive-landscape.md) |
| Откуда какой референс | [`PlanDocs/references/README.md`](PlanDocs/references/README.md) |
| Стек, i18n, демо-данные | [`PlanDocs/15-architecture.md`](PlanDocs/15-architecture.md) |
| Деплой | [`PlanDocs/16-ops-deploy.md`](PlanDocs/16-ops-deploy.md) |
| UI-принципы, свитчер «Оформление» | [`PlanDocs/17-design-guidelines.md`](PlanDocs/17-design-guidelines.md) |
| Тема AMIO | [`PlanDocs/17-theme-bank-1.md`](PlanDocs/17-theme-bank-1.md) |
| Тема Evoca | [`PlanDocs/17-theme-bank-2.md`](PlanDocs/17-theme-bank-2.md) |
| Что нельзя ломать | [`docs/INVARIANTS.md`](docs/INVARIANTS.md) |
| Открытые вопросы | [`docs/OPEN-QUESTIONS.md`](docs/OPEN-QUESTIONS.md) |
| Роли | [`docs/roles/`](docs/roles/) |
| Archive feedback loop (чеклист) | [`docs/ARCHIVE-FEEDBACK-LOOP.md`](docs/ARCHIVE-FEEDBACK-LOOP.md) |
| Живые спеки / changes | `openspec/` |

## 5. Процесс

1. **product** — ценность, non-goals, acceptance, сверка с [`02`](PlanDocs/02-competitive-landscape.md); дельта от Surf только явно.
2. **designer** — UI по `17` + теме банка; три языка; не впритык под русский.
3. `/opsx:propose` → proposal + design + tasks (в tasks — пункт обновить затронутые PlanDocs).
4. Утверждение владельцем.
5. `/opsx:apply` (**developer**) строго по tasks.
6. **devops** — preview-хост и CI уже есть (`16`); менять инфраструктуру только по задаче.
7. **Archive feedback loop (обязателен, каждый change):** перед `/opsx:archive` и в том же коммите, что архив — выровнять документацию по [`docs/ARCHIVE-FEEDBACK-LOOP.md`](docs/ARCHIVE-FEEDBACK-LOOP.md): PlanDocs (`01`, `15`, `17`, …), при необходимости `docs/roles/` (designer, developer, product). В `tasks.md` change — секция «Archive feedback loop» с чекбоксами. Затем `openspec archive` (delta specs). Архив **без** feedback loop — нарушение процесса. Агент **не ждёт** отдельной просьбы владельца «обнови доки».

Мелочь (опечатка, однострочный баг без продуктовой двусмысленности) — без полного change, с acceptance и инвариантами.

Новые фичи — только по явному решению владельца. Демо-скоуп зафиксирован в [`01`](PlanDocs/01-surf-baseline.md).
