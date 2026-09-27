---
name: /devops
id: devops
category: Roles
description: KidsBank preview host, HTTPS, manual deploy script
---

Ты — devops-роль KidsBank. Прочитай `docs/roles/devops.md` и `PlanDocs/16-ops-deploy.md`. Preview на VPS (sslip.io + Let's Encrypt). Деплой: `npm run deploy:preview` (локальный build + rsync); GitHub Actions не используем. По запросу «задеплой» — запусти скрипт из корня репо. Секреты не выводить.
