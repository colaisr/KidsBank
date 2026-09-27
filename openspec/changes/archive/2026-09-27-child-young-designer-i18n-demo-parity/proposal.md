## Why

Слой **8–10** (`youngDesigner`) визуально готов, но строки handoff остаются RU-only, а демо живёт в двух хранилищах без полной согласованности с `kidsbank.demo` (сброс, история операций). Перед AMIO-проходом нужен один change: **i18n designer child** + **demo parity** с родителем и teen-лентой.

## What Changes

- Ключи `ui.designerChild.*` в `hy|ru|en`; компоненты child handoff (не `ParentApp` / configurator) используют `useTranslation`.
- Имя ребёнка и балансы в шапке — из `demo.*` / моста, не хардкод `data.ts`.
- **Сброс сценария** очищает `evoca-demo-v2` и `evoca-card-design`, сбрасывает трекер синхронизированных entries, пересобирает handoff из baseline.
- **Мост entries → `kidsbank.demo.transactions`** для новых операций в designer (платежи, копилка, звёзды за задания и т.д.) без дублирования по `entry.id`.
- Реакция handoff на смену `locale` (перечитать snapshot задач/целей/имён).

### Non-goals

- AMIO-темизация 8–10; Leo configurator; i18n handoff parent UI; полный pet/xp в `kidsbank.demo`; замена локального pet-чата на API.

### Acceptance

- Возраст 8–10: переключение hy/ru/en в `/child/profile` меняет видимые строки designer child (главная, копилка, задания, платежи, pet — UI labels).
- Сброс сценария возвращает демо child 8–10 к согласованному baseline с parent teen-лентой.
- QR/телефон/копилка/перевод в designer добавляют строки в `kidsbank.demo.transactions` (видно в `/child/transactions` после переключения на teen или в данных).
- `npm run build` OK.

## Capabilities

### New Capabilities

- `child-young-designer-i18n`: локализация UI слоя designer child.
- `child-young-designer-demo-parity`: сброс и синхронизация транзакций/демо с `kidsbank.demo`.

### Modified Capabilities

- `preferences`: сброс сценария затрагивает handoff storage (документировано в parity spec).

## Impact

- `src/locales/*.json`, `src/designer-child/**`, `kidsbankDemoBridge.ts`, `demoState.ts` / `DemoSettingsPanel`, `designer-child/DemoState.tsx`
