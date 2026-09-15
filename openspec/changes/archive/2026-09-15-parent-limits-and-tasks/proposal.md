## Why

Roadmap кабинета родителя (`R-parent-roadmap`) выводит **сервисы** из быстрых действий в единое меню: геолокация, перевод, **лимиты**, **задания**. Нужны полноэкранные сценарии для лимитов (P2P whitelist + ATM) и заданий (список, подтверждение, создание) в одном change для архивации.

## What Changes

### IA главной `/parent`
- Быстрые действия: **только «Цель»** (задание и лимит убраны).
- **Сервисы:** геолокация, перевод, **лимиты**, **задания** (бейдж — число `waitingParent`).
- Секция «Задания ребёнка» на главной **удалена**.

### `/parent/limits` (change delta)
- Переводы: whitelist получателей, toggle, добавление получателя (sheet).
- Наличные: toggle ATM, stepper лимита, прогресс до max/день.
- Demo state **v7**: `transferRecipients`, `cashWithdrawal`.

### `/parent/tasks` (change delta)
- CTA «+ Новое задание»; секции **Ожидают** / **Выполнено сегодня**.
- Строки списка по макету; tap → edit или sheet подтверждения для `waitingParent`.
- `completedAt` на задаче при confirm; сид с демо «сегодня».

### Non-goals
- Отчёты, история запросов (следующие пункты меню).
- Реальный P2P / ATM backend.

### Acceptance
- hy / ru / en; AMIO / Evoca одна вёрстка.
- Бейдж на «Задания» = `waitingParent` count.
- `npm run build`; PlanDocs `01` обновлены при archive.

## Capabilities

### New
- `parent-limits`: экран лимитов и demo state полей.
- `parent-tasks`: экран заданий родителя.

### Modified
- `parent-home`: сервисы, бейдж, без списка заданий на главной.
- `demo-state`: v7 + `completedAt` на tasks.
- `app-shell`: `/parent/limits`, `/parent/tasks`.
- `parent-task-management`: UI перенос на dedicated route (поведение confirm/add сохранено).

## Impact

- Код: `ParentLimitsPage`, `ParentTasksPage`, `ParentServiceRow.badgeCount`, `ParentTaskListRow`, demo v7, локали `ui.parent.*`, `demo.limits.*`.
