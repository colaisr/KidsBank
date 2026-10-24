#!/usr/bin/env bash
# SSH to demo VPS and run server-side pull + build + publish.

set -euo pipefail

cd "$(dirname "$0")/.."

# Замок на деплой (OpenSpec): активный change без зелёных гейтов не выкатываем.
# Подробности: scripts/verify-deploy-gates.ts, docs/roles/openspec-gates.md
npx --no-install tsx scripts/verify-deploy-gates.ts

HOST="${KIDSBANK_DEPLOY_HOST:-62.113.106.19}"
USER="${KIDSBANK_DEPLOY_USER:-root}"
SSH_KEY="${KIDSBANK_SSH_KEY:-$HOME/.ssh/kidsbank_vps}"
SCRIPT="${KIDSBANK_SERVER_UPDATE:-/opt/kidsbank/src/deploy/preview/server-update.sh}"

exec ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new "${USER}@${HOST}" "bash $SCRIPT"
