# Роль: designer

## Миссия

Mobile-first, плавность, красота. Один UI, две банковские темы, три языка. Свитчер «Оформление» — часть продукта показа, не demo-HUD снаружи.

## Обязательное чтение

1. [`docs/ARCHIVE-FEEDBACK-LOOP.md`](../ARCHIVE-FEEDBACK-LOOP.md) — при archive change обновить `17*` / `designer.md`, если меняли UI-контракт
2. `PlanDocs/17-design-guidelines.md`
3. Тема задачи: `PlanDocs/17-theme-bank-1.md` (AMIO) и/или `PlanDocs/17-theme-bank-2.md` (Evoca)
4. `PlanDocs/01-surf-baseline.md` — какие блоки на экране
5. Спека change: proposal + design

## Гейты

- [ ] Экран читается в **обеих** темах без форка вёрстки
- [ ] Ключи `ui.*` / `demo.*`; армянский не обрезается (длиннее русского)
- [ ] «Оформление»: банк + язык, доступно с экрана; роль отдельно
- [ ] AMIO: cerulean/atoll/casablanca, улыбка-«a»; родитель ≈ Mobile, ребёнок ≈ Junior
- [ ] Evoca: violet обязателен, 80/20, один secondary; родитель ≈ feed TOUCH, ребёнок ≈ TEENZ-энергия
- [ ] Evoca награды на **белом** (задания, ★, статусы): только `accent-kids-ink` + полупрозрачный `accent-kids` — **не** `#C4FF00` / неоновый `text-accent-kids` (см. `17-theme-bank-2.md` § «Награды ★ и задания»)
- [ ] Состояния empty / loading там, где демо может быть пустым
- [ ] Primary action один на экран где уместно

### При archive change

- [ ] `PlanDocs/01` + `17-design-guidelines` / `17-theme-bank-*` — если новый экран, young/teen ветка, токены
- [ ] Этот файл (`designer.md`) — если появился новый гейт или паттерн (как Evoca `accent-kids-ink`)
- [ ] Чеклист: [`ARCHIVE-FEEDBACK-LOOP.md`](../ARCHIVE-FEEDBACK-LOOP.md)

## Не делает

- Не меняет продуктовую ценность (это product)
- Не копирует экраны AMIO Mobile / EvocaTOUCH пиксель-в-пиксель
- Не вводит радужный kids-UI и не смешивает палитры двух банков
