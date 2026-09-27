# Preview deploy (без GitHub Actions)

GitHub — только хранилище кода. Деплой по запросу владельца или агента.

## Вариант A — рекомендуемый (сборка на VPS)

Один раз на сервере (после добавления deploy key в GitHub):

```bash
scp -i ~/.ssh/kidsbank_vps deploy/preview/server-bootstrap.sh root@62.113.106.19:/tmp/
ssh -i ~/.ssh/kidsbank_vps root@62.113.106.19 'bash /tmp/server-bootstrap.sh'
```

Деплой с Mac:

```bash
npm run deploy:preview
```

## Вариант B — сборка локально + rsync

На машине, где есть Node и SSH-ключ `~/.ssh/kidsbank_vps`:

```bash
./scripts/deploy-preview.sh
```

Или `npm run deploy:preview`.

Агент Cursor при фразе «задеплой preview» выполняет этот скрипт из корня репозитория (нужен доступ к ключу на хосте пользователя).

## Вариант B — сборка на VPS

Один раз на сервере:

```bash
mkdir -p /opt/kidsbank
git clone git@github.com:colaisr/KidsBank.git /opt/kidsbank/src
# deploy key в GitHub → read-only на репо
chmod +x /opt/kidsbank/src/deploy/preview/server-update.sh
```

Деплой (вручную или агент по SSH):

```bash
ssh -i ~/.ssh/kidsbank_vps root@62.113.106.19 \
  '/opt/kidsbank/src/deploy/preview/server-update.sh'
```

На VPS нужны Node 22+ и `npm`. Минуты GitHub Actions не тратятся.

## Куда кладётся статика

`/var/www/kidsbank/` — см. `PlanDocs/16-ops-deploy.md`.
