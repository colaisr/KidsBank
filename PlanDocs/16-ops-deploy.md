# 16 — Ops / деплой

Статус: актуален (2026-09-27). Preview-хост поднят; деплой **только вручную** (GitHub Actions отключены).

## Цель

HTTPS URL, который открывается на телефоне. Статика из Vite `build`.

## Preview (VPS)

| | |
|---|---|
| **HTTPS (основной)** | https://62-113-106-19.sslip.io/ |
| **IP** | `62.113.106.19` → редирект на HTTPS URL выше |
| **Путь на сервере** | `/var/www/kidsbank/` |
| **TLS** | Let's Encrypt (certbot, автообновление) |
| **SSH** | `ssh -i ~/.ssh/kidsbank_vps root@62.113.106.19` |

Домена нет — используется [sslip.io](https://sslip.io) (`62-113-106-19.sslip.io` резолвится в IP VPS). Сертификат валидный, без предупреждения браузера.

### Деплой

**GitHub** — только git remote (код). **Push в `main` не деплоит** (нет workflow на Actions).

**По умолчанию (сборка на VPS):**

```bash
npm run deploy:preview
# то же: ./scripts/remote-deploy.sh
```

На сервере: `git pull` в `/opt/kidsbank/src` → `npm ci` → `npm run build` → `rsync dist/` в `/var/www/kidsbank/`. Скрипт: `deploy/preview/server-update.sh`. Одноразовая настройка: `deploy/preview/server-bootstrap.sh` (Node, deploy key, clone).

**Агент Cursor:** по запросу «задеплой» — `npm run deploy:preview` (SSH на VPS + `server-update.sh`).

**Запасной вариант (сборка локально):** `./scripts/deploy-preview.sh` — rsync `dist/` с Mac, если на VPS нет git/Node.

Минимальный rsync без скрипта:

```bash
npm run build
rsync -avz --delete -e "ssh -i ~/.ssh/kidsbank_vps" dist/ root@62.113.106.19:/var/www/kidsbank/
```

## Чеклист

- [x] Preview URL (HTTPS)
- [x] Viewport mobile, нет десктоп-лома
- [x] `?bank=amio|evoca` и `?lang=hy|ru|en` сохраняются
- [x] Нет секретов в репо
- [x] Деплой вручную (`npm run deploy:preview`); Actions при push отключены (2026-09-27)

## Для следующего агента

- **Демо сдано** — скоуп в `PlanDocs/01-surf-baseline.md`. Новые задачи — только по решению владельца.
- **Локально:** `npm run dev`. **На сервере:** только `dist/` в `/var/www/kidsbank/`; nginx не трогать без задачи.
- **SSH:** локальный ключ `~/.ssh/kidsbank_vps` (секрет GitHub Actions больше не используется).
- **Темы:** при смене банка цвета идут через `--kb-*` на `html[data-theme]`; в `index.css` — `@theme inline`.

Не копировать VPS AgentPoint/Joompers. Не поднимать Compose.

## Co-hosted: AI-tutor (2026-09-09)

На **том же VPS** (`62.113.106.19`) планируется AI-tutor:

| Путь | Проект |
| --- | --- |
| `/` | KidsBank (этот репо, без изменений в deploy) |
| `/aitutor/` | AI-tutor UI |
| `/api/` | AI-tutor API |
| `/api/kidsbank/` | KidsBank Leo chat proxy → `127.0.0.1:8091` (Docker `deploy/leo-chat`, ключ `POLZA_API_KEY` только в `/opt/kidsbank/leo-chat/.env`) |

**KidsBank статика** — по-прежнему rsync в `/var/www/kidsbank/` (ручной скрипт, не Actions). Nginx: блок `/api/kidsbank/` **выше** `/api/` (AI-tutor). Сниппет — `deploy/leo-chat/nginx-snippet.conf`. Leo-chat на VPS: `rsync deploy/leo-chat/` → `/opt/kidsbank/leo-chat/`, `docker compose up -d`. Nginx на сервере также расширяется из репозитория AItutor (`deploy/nginx/shared-host.conf`); перед применением делается backup `kidsbank.bak.*`.

Если после обновления nginx KidsBank перестал открываться — восстановить backup из `/etc/nginx/sites-available/kidsbank.bak.*`.
