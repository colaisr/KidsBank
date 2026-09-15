# 17 — Тема Evoca (банк 2)

Статус: актуален (2026-09-01). Обязателен для `/designer` на теме `evoca`.

У банка есть публичный брендбук — он сильнее Brandfetch.

## Источники

1. [evoca.am/ru](https://www.evoca.am/ru)
2. [Evoca Brandbook PDF](https://www.evoca.am/file_manager/other/Evoca%20Brandbook%20(1).pdf)
3. [О банке: лого, цвета, ценности](https://www.evoca.am/en/general-information-history-key-values)
4. Взрослый UI: [EvocaTOUCH](https://www.evoca.am/en/digital-services-evocatouch-mobile-banking/) — feed, Stories, Light/Dark
5. Детский продукт: **EvocaTEENZ** — не клонировать 1:1; энергия «cool teen» для kids-кабинета
6. Сводка ссылок: [`references/bank-2/README.md`](references/bank-2/README.md)

Brandfetch `#E79738` Fire Bush **не** использовать как primary — в брендбуке этого цвета нет.

## Характер

Имя: Evolution + Evoke. Лого: **V как стрелка вверх-вправо**. Human-first smart fintech, «dream bravely». Фиолетовый = молодость и новое. Голос на «ты». Не «заботливый cyan-банк».

## Токены

| Токен | HEX |
|-------|-----|
| Evoca Violet | `#6400DC` — **обязателен** на каждом экране |
| Tints | `#8448FF` `#BD83FF` `#C3B2FF` |
| Gray | `#7F7F7F` |
| Neutral lilac | `#F4EAF6` — фон детского кабинета |
| Lime (брендбук) | `#C4FF00`, `#E4FF90` — **только** маркетинг / hero; **не** как hex в коде на белых карточках |
| Lime UI (код) | `--kb-accent-kids: #D2EE96` — мягкие заливки (`bg-accent-kids/15`…`/25`) |
| Lime ink (код) | `--kb-accent-kids-ink: #6A8F2E` — ★, дедлайны, чекбоксы заданий **на белом / surface** |
| Coral | `#FF2D61` / `#FE7944` — один акцент CTA |
| Turquoise | `#32BBC5` — инфографика, не primary |

Правила брендбука:

- На белом/чёрном Violet ~80%; Lime/Coral/Turquoise суммарно ≤ 20%.
- **Один secondary на экран.**
- Градиенты только с Violet как якорем.
- Заголовки Nomixa (или близкий grotesk); UI Montserrat. Evoca Script — редкий H1, не формы.
- Light по умолчанию. Dark — опция, не обязателен на первом показе.

## Кабинеты

- **Родитель** ≈ TOUCH по тону: взрослый dashboard на `/parent` — hero, сетка быстрых действий 2×2, карточные списки. **Одна раскладка** для AMIO и Evoca; смена банка — только цветовые токены (не feed vs grid).
- **Ребёнок**: lilac фон, крупные цифры, цели и задания; награды **lime**, не оранжевые звёзды AMIO. Табы как на макете Junior (Главная / Цели / FAB / Транзакции / Питомец); визуал по теме Evoca.

FAB ребёнка и primary — **violet** (`--kb-fab`), не Casablanca. Карта: фиолетовый градиент + V; выбор дизайна карты можно показать как фичу Evoca. На главной один secondary — **мягкий lime** на наградах (см. ниже), не кислотный неон.

Маскот: от V-стрелки, тон cool teen, не няня.

## Награды ★ и задания (обязательно для designer)

Брендбук допускает яркий `#C4FF00`, но в **прототипе** этот цвет на белых карточках (задания, звёздный счёт, шапка с бейджем ★) даёт «вырви глаз» и **запрещён в CSS**.

| Контекст | Класс / токен | Нельзя |
|----------|----------------|--------|
| Текст статуса задания, ★ на `bg-surface` | `text-accent-kids-ink` → `--kb-accent-kids-ink` | `text-accent-kids`, `#C4FF00` |
| Плашки награды, фон чекбокса «ждёт родителя» | `bg-accent-kids/15`…`20`, `border-accent-kids-ink/35` | сплошной `#C4FF00`, `bg-accent-kids` без прозрачности на белом |
| ★ на **фиолетовой** карте продукта | `text-accent-kids` (ярче) | — |

Реализация: `src/themes/evoca.css`, дочерние скины в `card-skins.css` для `[data-theme='evoca']` — не возвращать `#c4ff00` в `--kb-accent-kids`.

AMIO не менять: там `--kb-accent-kids-ink` = оранжевый `--kb-accent-kids`.

## Do / don't

Делать: violet везде, 80/20, один акцент, AMD; на светлых карточках — пара `accent-kids` + `accent-kids-ink`.

Не делать: cyan AMIO в этой теме; **`#C4FF00` / `text-accent-kids` на белом для текста и ★**; все secondary сразу; milky-white без фиолетового; клон Prometey; пиксельный клон TOUCH/TEENZ.
