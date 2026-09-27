## Why

Дизайнер передал готовый интерактивный фронт **Evoca Kids** (handoff 2026-09-24): motion, Лео на видео, карусель карты, единый child shell. В KidsBank young-кабинет для 6–10 был одним слоем; для показа нужно **три возрастных UI**: 6–8 — текущий young, **8–10 — дизайнерский handoff**, 10–12+ — teen. Родительский кабинет остаётся нашим (админка/демо родителя).

## What Changes

- **BREAKING (семантика experience):** `childExperience` расширяется до `young` | `youngDesigner` | `teen`.
- Онбординг возраста: `6-8` → `young`; `8-10` → `youngDesigner`; `10-12`, `12-14`, `14-17` → `teen`. Миграция: сохранённый `young` + `kidsbank.childAgeRange=8-10` читается как `youngDesigner`.
- Встраивание handoff в `src/designer-child/` + ассеты `public/` (из архива `evoca-kids-app-2026-09-24`).
- `/child` при `youngDesigner`: рендер `DesignerChildExperience` (экспорт `HomeApp` handoff) — полный child UX демо (hash-флоу, pet, платежи), без замены parent shell.
- `ChildShell`: скрыт tab bar для `young` и `youngDesigner`; deep-link `/child/*` (кроме profile и onboarding) при `youngDesigner` → редирект на `/child`.
- Мост `kidsbankDemoBridge`: синхронизация ядра `kidsbank.demo` ↔ `evoca-demo-v2` (балансы, задания, получатели, цели, лимиты наличных) + событие `kidsbank-demo-updated` при записи демо.
- Зависимости handoff: Motion, Phosphor, Radix UI kit, Inter variable, и др. (см. `package.json`).
- **Non-goals:** замена parent UI handoff; i18n строк handoff (пока RU в UI слоя); AMIO-скин для 8–10 (следующий этап); полная зеркализация transaction `entries` в teen-ленту; Leo configurator как отдельный entry в KidsBank.

### Acceptance

- Профиль → возраст **6–8** → прежний young home (док Лео, наши young-маршруты).
- **8–10** → UI как в handoff (карусель, SharedLion, bottom nav, hash-экраны); переход в parent по шапке работает; parent shell без изменений.
- **10–12+** → teen home с tab bar, как до change.
- Подтверждение задания родителем обновляет задания/звёзды у ребёнка 8–10 (через мост демо).
- `npm run build` OK; AMIO **6–8** young без регрессии; bank/lang переключатели не ломаются (8–10 визуально Evoca-handoff до отдельного AMIO-прохода — задокументировано).

## Capabilities

### New Capabilities

- `child-young-designer-handoff`: интеграция дизайнерского child shell для возраста 8–10, мост демо-состояния, ограничения маршрутизации.

### Modified Capabilities

- `preferences`: третье значение `youngDesigner`, миграция storage.
- `profile-onboarding`: маппинг возраста на три experience.
- `child-home`: маршрутизация `/child` на teen | young | designer.
- `child-nav`: скрытие tab bar при `youngDesigner`.
- `child-young-home`: scope только **6–8** (8–10 исключён).

## Impact

- `src/context/childExperience.ts`, `ChildHomePage`, `ChildShell`, `DesignerChildExperience.tsx`
- `src/designer-child/**`, `public/assets/**`, `vite.config.ts` (alias `@`), `tsconfig` paths
- `src/context/demoState.ts` (custom event)
- `package.json` / lockfile (handoff deps)
- PlanDocs `01`, `15`, `17` (archive feedback loop)
