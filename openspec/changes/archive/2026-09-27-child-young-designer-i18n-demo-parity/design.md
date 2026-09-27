## Context

Handoff хранит операции в `entries[]` внутри `evoca-demo-v2`. KidsBank — в `transactions[]`. Мост уже синхронизирует балансы и задачи.

## Goals

- Единый источник правды: `kidsbank.demo`; handoff — проекция + UI state.
- i18n через существующий i18next, префикс `ui.designerChild`.
- Идемпотентная синхронизация entries по `entry.id`.

## Decisions

1. **Трекер `syncedDesignerEntryIds`** в `kidsbankDemoBridge.ts` (Set в module scope), сброс при `clearDesignerHandoffStorage()`.
2. **`mapDesignerEntryToTransaction`**: `kind` + `currency` + эвристики label → `TransactionTypeId` (`spend`, `cardToPiggy`, `piggyToCard`, `taskReward`, `mobileTopUp` для телефона, QR по label/key).
3. **`resetDemoState`** вызывает `clearDesignerHandoffStorage()` + `mergeKidsBankIntoHandoffStorage()`.
4. **i18n**: `useDesignerChildT()` → `useTranslation` с `keyPrefix: 'ui.designerChild'`; child-facing TSX; `data.ts` name не используется в UI — `demo.david.name`.
5. **`languageChanged` listener** в `DemoState` useModel: `mergeKidsBankIntoHandoffStorage` + re-read.

## Risks

- Эвристики label на RU — для i18n добавить `entryKind` в bridge mapping по `kind` primarily.

## Open Questions

- Нет — AMIO отдельным change.
