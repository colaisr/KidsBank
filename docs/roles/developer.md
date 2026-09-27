# Роль: developer

## Миссия

Реализовать утверждённую спеку в паттернах прототипа: Vite/React, темы, i18n. Не ломать инварианты.

## Текущее состояние (2026-09-02)

- **Демо сдано** — прототип готов к показу, ждёт утверждения или следующих шагов.
- Реализованный скоуп — [`PlanDocs/01-surf-baseline.md`](../../PlanDocs/01-surf-baseline.md).
- Живые спеки: `openspec/specs/`. История changes: `openspec/changes/archive/`.
- **Деплой:** по запросу `npm run deploy:preview` (не при push); preview https://62-113-106-19.sslip.io/

## Обязательное чтение

1. `docs/INVARIANTS.md`
2. `AGENTS.md` §2
3. `PlanDocs/15-architecture.md`
4. Change: `openspec/changes/<name>/{proposal,design,tasks}.md` (или архив + `openspec/specs/`)
5. Соседний код того же экрана/темы

## Модуль `designer-child` (8–10)

- Vendor-код handoff в `src/designer-child/`, статика в `public/assets/`.
- Точка входа: `DesignerChildExperience` (lazy), обёртка `HomeApp`; CSS scoped `.kb-designer-child`.
- Демо: `kidsbankDemoBridge.ts` + событие `kidsbank-demo-updated` при записи `kidsbank.demo`.
- Сброс сценария: `resetDemoState()` вызывает `clearDesignerHandoffStorage()` (`evoca-demo-v2`, `evoca-card-design`, трекер `syncedDesignerEntryIds`), затем `mergeKidsBankIntoHandoffStorage()`.
- Новые операции handoff (`entries[]`) дублируются в `kidsbank.demo.transactions` идемпотентно (`designer:<entryId>`); смена языка — `i18n` `languageChanged` → re-merge задач/имён в handoff.
- Строки child UI: `useDesignerChildT()` / `ui.designerChild.*`; QR-демо как у young — `data/youngQrPay.ts` + `DemoMerchantQrGraphic`, без `getUserMedia`.
- AMIO/Evoca: `theme-amio.css` под `html[data-theme='amio'] .kb-designer-child`; не писать `--brand*` на `:root` из `leoConfig`; `designerCardSkin.ts` синхронизирует `kidsbank.cardSkin` с handoff-картой; `leoConfigForBank` + атрибут `color` у `lion-mascot`; подпись продукта на карте — `ui.designerChild.cardDesign.productLabel.{bank}`; Evoca-растр (★/копилка/львёнок) — класс `brand-raster-art` + фильтр в `theme-amio.css`; аватар — `designerChildAvatarSrc(bank)` → `avatar.png` / `avatar-amio.png`.
- Не тянуть глобальные `button` reset handoff на KidsBank chrome — `kb-role-toggle`.

## Правила

- Спека первична: конфликт спеки и кода → СТОП, правка спеки, потом код
- Строки только через `t(...)`. Фикстуры — id
- Темы: CSS-переменные `--kb-*` на `html[data-theme]`; Tailwind — `@theme inline`, не обычный `@theme` (иначе цвета не переключаются)
- Новый экран: токены темы, не захардкоженный `#05A9C7` / `#6400DC` в JSX, кроме определения токенов
- Чекбоксы в `tasks.md` отмечать по мере выполнения
- Минимальный diff

## DoD

- [ ] Tasks и acceptance выполнены
- [ ] hy + ru + en для новых ключей
- [ ] Обе темы не разъехались
- [ ] Archive feedback loop: PlanDocs + roles по [`docs/ARCHIVE-FEEDBACK-LOOP.md`](../ARCHIVE-FEEDBACK-LOOP.md) **до** `openspec archive`, в том же коммите что архив
- [ ] Нет секретов в коммите
- [ ] После merge в `main` — по запросу владельца задеплоить preview (`npm run deploy:preview`)

## Не делает

- Не начинает крупную фичу без proposal/tasks (кроме мелочи)
- Не добавляет бэкенд, БД, auth «на всякий случай»
- Не деплоит секреты и не правит VPS вручную, если хватает CI
