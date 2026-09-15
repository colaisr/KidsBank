# 16 — Ops / деплой

Статус: актуален (2026-09-02). Preview-хост поднят, демо сдано.

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

**Автоматически:** каждый `push` в `main` → GitHub Actions (`.github/workflows/deploy.yml`) → `npm ci` → `npm run build` → `rsync` на VPS.

Секрет в GitHub: `DEPLOY_SSH_KEY` (приватный ключ `~/.ssh/kidsbank_vps`). Ручной запуск: Actions → *Deploy to demo VPS* → *Run workflow*.

**Вручную (локально):**

```bash
npm run build
rsync -avz --delete -e "ssh -i ~/.ssh/kidsbank_vps" dist/ root@62.113.106.19:/var/www/kidsbank/
```

## Чеклист

- [x] Preview URL (HTTPS)
- [x] Viewport mobile, нет десктоп-лома
- [x] `?bank=amio|evoca` и `?lang=hy|ru|en` сохраняются
- [x] Нет секретов в репо
- [x] CI/CD: push `main` → deploy

Статус Actions: https://github.com/colaisr/KidsBank/actions

## Для следующего агента

- **Демо сдано** — скоуп в `PlanDocs/01-surf-baseline.md`. Новые задачи — только по решению владельца.
- **Локально:** `npm run dev`. **На сервере:** только `dist/` через CI; nginx не трогать без задачи.
- **Секреты:** `DEPLOY_SSH_KEY` в GitHub Settings → Secrets; локальный ключ `~/.ssh/kidsbank_vps`.
- **Темы:** при смене банка цвета идут через `--kb-*` на `html[data-theme]`; в `index.css` — `@theme inline`.

Не копировать VPS AgentPoint/Joompers. Не поднимать Compose.

## Co-hosted: AI-tutor (2026-09-09)

На **том же VPS** (`62.113.106.19`) планируется AI-tutor:

| Путь | Проект |
| --- | --- |
| `/` | KidsBank (этот репо, без изменений в deploy) |
| `/aitutor/` | AI-tutor UI |
| `/api/` | AI-tutor API |

**KidsBank CI/CD не меняется** — rsync в `/var/www/kidsbank/`. Nginx на сервере расширяется из репозитория AItutor (`deploy/nginx/shared-host.conf`); перед применением делается backup `kidsbank.bak.*`.

Если после обновления nginx KidsBank перестал открываться — восстановить backup из `/etc/nginx/sites-available/kidsbank.bak.*`.
