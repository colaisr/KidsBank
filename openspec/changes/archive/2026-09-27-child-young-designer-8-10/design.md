## Context

Handoff-пакет `evoca-kids-app-2026-09-24` — самостоятельный Vite/React child+parent фронт с локальным `evoca-demo-v2`. KidsBank уже имел бинарный `young|teen` (6–10 vs 10–12+). Нужно встроить handoff **только для 8–10** без замены parent shell и без потери AMIO young 6–8.

См. `proposal.md` — мотивация и acceptance.

## Goals / Non-Goals

**Goals:**

- Три возрастных child UI: `young` (6–8), `youngDesigner` (8–10), `teen` (10–12+).
- Vendor-код handoff в `src/designer-child/`, статика в `public/`.
- Единый `kidsbank.demo` для parent + designer child (мост полей).
- Сохранить react-router оболочку KidsBank (`PhoneFrame`, parent routes, profile, onboarding).

**Non-Goals:**

- Parent UI из handoff; Leo configurator entry; полный i18n handoff; AMIO-темизация 8–10; зеркалирование всех `entries` handoff в teen transactions.

## Decisions

1. **Vendor folder, не submodule** — копия `app/src` → `src/designer-child/` для автономного diff и alias `@` → `designer-child` (как в handoff). Альтернатива git submodule — отклонена (лишняя операционка для прототипа).

2. **Точка входа `DesignerChildExperience`** — обёртка импортирует CSS handoff, `DemoProvider`, `HomeApp` (экспортирован из `designer-child/App.tsx`). Parent `ParentApp` handoff не монтируется.

3. **Маршрутизация** — при `youngDesigner` deep links `/child/*` (кроме `/child/profile`, onboarding) редиректят на `/child`; внутренние экраны — hash/history handoff (`#savings`, `#pet`, …). Альтернатива — переписать handoff на react-router — отклонена (ломает parity с демо).

4. **Демо-мост** — `kidsbankDemoBridge.ts` + патч `designer-child/DemoState.tsx`: при `read()` подмешивать snapshot из `kidsbank.demo` в `evoca-demo-v2`; при `update()` писать обратно ключевые поля; `writeDemoState` диспатчит `kidsbank-demo-updated`. ID получателей: `mom/grandma/friend` ↔ `mama/grandmother/timur`.

5. **Зависимости** — добавлены пакеты handoff (motion, phosphor, radix, …). Сборка ~1MB+ JS chunk — приемлемо для демо.

6. **Тема банка** — `data-theme` остаётся глобальным; handoff CSS визуально Evoca. AMIO для 8–10 — отдельный change.

## Risks / Trade-offs

- **[Risk] Два storage ключа** (`kidsbank.demo`, `evoca-demo-v2`) → рассинхрон entries/history. **Mitigation:** мост только для сценариев parent↔child (tasks, balances, limits, goals).
- **[Risk] RU-only copy в designer layer** при hy/en. **Mitigation:** задокументировано; bank/lang на Appearance работают для остального приложения.
- **[Risk] Bundle size** — **Mitigation:** lazy не внедрён в v1; допустимо для прототипа.

## Migration Plan

- Пользователи с `kidsbank.childExperience=young` и `kidsbank.childAgeRange=8-10` при чтении получают `youngDesigner`.
- Новый выбор 8–10 в онбординге пишет `youngDesigner` явно.
- Откат: удалить `youngDesigner` из mapping и не рендерить `DesignerChildExperience`.

## Open Questions

- Когда переносить i18n ключи для designer shell (отдельный change).
- AMIO visual pass для 8–10 (токены `data-theme=amio` поверх handoff CSS).
