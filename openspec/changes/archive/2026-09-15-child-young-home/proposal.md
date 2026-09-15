## Why

Онбординг уже спрашивает возраст, но выбор не влияет на UI. Для показа нужен отдельный кабинет **6–10** (макет AMIO Junior с тотемом внизу), при этом текущая главная **10–12** остаётся эталоном без изменений. Родительский shell не трогаем.

## What Changes

- Персистентный **child experience** (`young` | `teen`) из выбора возраста: `6-8` и `8-10` → young; `10-12`, `12-14`, `14-17` → teen.
- Ключ `kidsbank.childExperience` в слое preferences (не сбрасывается «Сбросить сценарий»).
- `/child`: teen — существующая главная; young — новая раскладка по макету (шапка с именем и ★, карта, три быстрых действия без навигации, копилка/звёздный счёт, задания, док с тотемом льва).
- У young скрыт `ChildTabBar`; тап по льву → `/child/young/totem` (заглушка до change «играть/разговор»).
- Быстрые кубики (телефон / QR / перевод) — только визуал, без сценариев (отдельные changes).

### Non-goals

- Изменения parent shell и экранов родителя.
- Навигация и флоу для кубиков быстрых действий.
- Экран play/talk у тотема (только placeholder route).
- Отдельные young-версии всех таб-маршрутов teen.

### Acceptance

- Профиль → ребёнок → `6-8` или `8-10` → Continue → young home без tab bar, с львом внизу.
- `10-12` (и 12–14, 14–17) → прежняя главная с tab bar.
- hy/ru/en; `npm run build` OK.
- Teen home визуально и по поведению как до change при `teen`.

## Capabilities

### New Capabilities

- `child-young-home`: young главная и totem dock.

### Modified Capabilities

- `preferences`: child experience persistence.
- `profile-onboarding`: возраст влияет на experience при Continue.
- `child-nav`: tab bar скрыт при young (не только onboarding).
- `child-home`: маршрутизация teen vs young на `/child`.
