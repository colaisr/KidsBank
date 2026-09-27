# PlanDocs — индекс

> Не читать файлы подряд. Найди строку → открой **один** файл.

PlanDocs = «зачем и что задумано». Как система работает в коде — `openspec/specs/`. Расходятся — решение владельца, не молчаливая правка.

При каждом **`/opsx:archive`** агент обновляет затронутые PlanDocs по чеклисту [`docs/ARCHIVE-FEEDBACK-LOOP.md`](../docs/ARCHIVE-FEEDBACK-LOOP.md) (не откладывать «на потом»).

## Конституция и продукт

| Файл | Статус | Что внутри | Здесь НЕ искать |
| --- | --- | --- | --- |
| [`00-product-overview.md`](00-product-overview.md) | Актуален | Цель прототипа, кабинеты, банки, языки, non-goals, статус демо | Экраны по блокам → `01` |
| [`01-surf-baseline.md`](01-surf-baseline.md) | Актуален | Карта блоков Surf → демо-сценарии. Новая игра/экран **дописывается сюда до archive** | Пиксели → `17` + theme |
| [`02-competitive-landscape.md`](02-competitive-landscape.md) | Актуален | У кого есть kids-приложение, чем не мы, откуда референс | Файлы скринов → `references/` |

## Стек и ops

| Файл | Статус | Что внутри | Здесь НЕ искать |
| --- | --- | --- | --- |
| [`15-architecture.md`](15-architecture.md) | Актуален, тонкий | Vite/React, темы, i18n, где демо-данные | Прод-банк, БД, API — не здесь |
| [`16-ops-deploy.md`](16-ops-deploy.md) | Актуален | Preview HTTPS, VPS, ручной deploy | SSH-ключ локально |

## Дизайн

| Файл | Статус | Что внутри | Здесь НЕ искать |
| --- | --- | --- | --- |
| [`17-design-guidelines.md`](17-design-guidelines.md) | Актуален | Телефон, motion, «Оформление», роль vs банк vs язык | Палитра банка → theme-файлы |
| [`17-theme-bank-1.md`](17-theme-bank-1.md) | Актуален | AMIO | Evoca → `17-theme-bank-2` |
| [`17-theme-bank-2.md`](17-theme-bank-2.md) | Актуален | Evoca | AMIO → `17-theme-bank-1` |

## Референсы

| Путь | Что |
| --- | --- |
| [`references/README.md`](references/README.md) | Индекс: какой референс откуда |
| [`references/surf-bank-for-kids.md`](references/surf-bank-for-kids.md) | Канон Surf + вторичный SBI |
| [`references/bank-1/`](references/bank-1/) | AMIO: скрины + ссылки |
| [`references/bank-2/`](references/bank-2/) | Evoca: брендбук + ссылки |
