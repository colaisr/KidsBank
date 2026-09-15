## Context

Реализация уже согласована с внутренним макетом (сегмент, пресеты, регулярность). Демо-логика перевода — `transferParentToChild` в `demoActions`; модалка `TransferModal` с главной снята.

## Goals / Non-Goals

**Goals:**

- Полноэкранный adult-banking flow на `bg-surface-muted`, primary CTA с `--kb-header-gradient`.
- Сегмент и чипы сумм с контрастом active/inactive (трек `primary/5`, выбранный пресет — surface + ring).
- Recurring block: iOS-style switch + sheet выбора периода (неделя Пт/Пн, месяц) — только UI state.
- Presenter ℹ️ на `ChildPageTitle` с `parent-transfer`.

**Non-goals:**

- Persist recurring schedule in `localStorage`.
- Custom keyboard masks beyond numeric input for «Своя» сумма.

## Decisions

### 1. IA: Services block

**Choice:** Transfer leaves 2×2 quick actions; geolocation + transfer grouped under titled section «Сервисы».

**Rationale:** Parity with roadmap mock; geolocation and transfer are «bank services», tasks/goals/limit stay operational shortcuts.

### 2. Route & chrome

**Choice:** `/parent/transfer` nested in `ParentShell`; `isParentSubScreen` includes transfer; `ChildPageTitle` with `backTo="/parent"`.

**Rationale:** Same pattern as geolocation; child name in title from `activeChildId`.

### 3. Amount UX

**Choice:** Presets `[200, 500, 1000]` + custom numeric field; default preset 500; wallet pill above segment.

**Rationale:** Mock presets; insufficient funds disables CTA and shows alert copy.

### 4. Post-submit

**Choice:** Success message ~900ms then `navigate('/parent')`.

**Rationale:** Keeps demo snappy without modal stack.

## Risks / Trade-offs

- **Recurring UI without backend** — presenter copy must clarify «демо» in demo steps.
- **Unused TransferModal** — dead code until removed in a hygiene change.
