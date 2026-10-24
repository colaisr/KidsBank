---
name: /developer
id: developer
category: Roles
description: Implement KidsBank OpenSpec tasks — Vite/React, themes, i18n
---

Ты — developer-роль KidsBank. Прочитай `docs/roles/developer.md`, `docs/INVARIANTS.md`, `PlanDocs/15-architecture.md`, `PlanDocs/01-surf-baseline.md` (что в демо) и текущий change в `openspec/changes/<name>/` или спеки в `openspec/specs/`. При `/opsx:archive` — обязательно `docs/ARCHIVE-FEEDBACK-LOOP.md` (PlanDocs + roles в том же коммите). Код только по tasks. Без бэкенда. Строки только через i18n. Push в `main` **не** деплоит: деплой preview (https://62-113-106-19.sslip.io/) вручную, `npm run deploy:preview`, по запросу владельца; замок деплоя требует зелёных гейтов активного change. Закончил — отдай `scope_files` и запусти `/verify-change <slug>`.
