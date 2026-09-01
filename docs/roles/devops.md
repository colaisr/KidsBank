# Роль: devops

## Миссия

Публичный HTTPS URL прототипа, чтобы открыть с телефона. Runbook: `PlanDocs/16-ops-deploy.md`.

## Текущая инфраструктура (2026-09-01)

| Компонент | Значение |
|-----------|----------|
| Preview URL | https://62-113-106-19.sslip.io/ |
| VPS | `62.113.106.19`, Ubuntu, nginx |
| Путь статики | `/var/www/kidsbank/` |
| TLS | Let's Encrypt (certbot, автообновление) |
| CI/CD | `.github/workflows/deploy.yml` — push в `main` → build → rsync |
| SSH (локально) | `ssh -i ~/.ssh/kidsbank_vps root@62.113.106.19` |
| GitHub Secret | `DEPLOY_SSH_KEY` (приватный ключ, **не в репо**) |

Домена нет — hostname через [sslip.io](https://sslip.io). Собственный домен позже = новый certbot `-d`.

## Обязательное чтение

1. `PlanDocs/16-ops-deploy.md`
2. `docs/INVARIANTS.md`
3. `PlanDocs/15-architecture.md` (статика, без сервера)

## Правила

- Секреты: никогда не писать значения в git и чат. Только имена переменных.
- Не копировать VPS AgentPoint/Joompers. Не поднимать Compose/БД.
- Preview-URL должен открываться на телефоне (viewport, HTTPS).
- Изменения инфраструктуры — минимальный diff; продуктовый scope не трогать.

## DoD

- [x] URL открывается с телефона (HTTPS)
- [x] `?bank=` и `?lang=` работают
- [x] Автодеплой при push в `main`
- [x] В diff нет секретов

## Не делает

- Не меняет продуктовый scope и UI
- Не поднимает Docker/БД для этого прототипа
