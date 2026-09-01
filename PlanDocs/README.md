# PlanDocs — индекс

> Не читать файлы подряд. Найди строку → открой **один** файл.

PlanDocs = «зачем и что задумано». Как система работает в коде — `openspec/specs/` (появится после первых archive). Расходятся — решение владельца, не молчаливая правка.

## Конституция и продукт

| Файл | Статус | Что внутри | Здесь НЕ искать |
| --- | --- | --- | --- |
| [`00-product-overview.md`](00-product-overview.md) | Актуален | Цель прототипа, кабинеты, банки, языки, non-goals | Фазы работ → `19`. Экраны по блокам → `01` |
| [`01-surf-baseline.md`](01-surf-baseline.md) | Актуален | Карта блоков Surf → демо-сценарии | Пиксели → `17` + theme |

## Стек и ops

| Файл | Статус | Что внутри | Здесь НЕ искать |
| --- | --- | --- | --- |
| [`15-architecture.md`](15-architecture.md) | Актуален, тонкий | Vite/React, темы, i18n, где демо-данные | Прод-банк, БД, API — не здесь |
| [`16-ops-deploy.md`](16-ops-deploy.md) | Черновик | Чеклист телефона; хост ещё не выбран | Секреты |

## Дизайн

| Файл | Статус | Что внутри | Здесь НЕ искать |
| --- | --- | --- | --- |
| [`17-design-guidelines.md`](17-design-guidelines.md) | Актуален | Телефон, motion, «Оформление», роль vs банк vs язык | Палитра банка → theme-файлы |
| [`17-theme-bank-1.md`](17-theme-bank-1.md) | Актуален | AMIO | Evoca → `17-theme-bank-2` |
| [`17-theme-bank-2.md`](17-theme-bank-2.md) | Актуален | Evoca | AMIO → `17-theme-bank-1` |

## Работы

| Файл | Статус | Что внутри |
| --- | --- | --- |
| [`19-work-plan.md`](19-work-plan.md) | Актуален | **План работ**: фазы 0–6, очередь, Definition of Done фазы |

## Референсы

| Путь | Что |
| --- | --- |
| [`references/surf-bank-for-kids.md`](references/surf-bank-for-kids.md) | Канон Surf + вторичный SBI |
| [`references/bank-1/`](references/bank-1/) | AMIO: скрины + ссылки |
| [`references/bank-2/`](references/bank-2/) | Evoca: брендбук + ссылки |
