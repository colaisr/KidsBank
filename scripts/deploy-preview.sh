#!/usr/bin/env bash
# Build KidsBank locally and rsync dist/ to the demo VPS.
# Usage: ./scripts/deploy-preview.sh
# Env: KIDSBANK_DEPLOY_HOST (default 62.113.106.19)
#      KIDSBANK_DEPLOY_USER (default root)
#      KIDSBANK_DEPLOY_PATH (default /var/www/kidsbank)
#      KIDSBANK_SSH_KEY (default ~/.ssh/kidsbank_vps)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

HOST="${KIDSBANK_DEPLOY_HOST:-62.113.106.19}"
USER="${KIDSBANK_DEPLOY_USER:-root}"
PATH_ON_SERVER="${KIDSBANK_DEPLOY_PATH:-/var/www/kidsbank}"
SSH_KEY="${KIDSBANK_SSH_KEY:-$HOME/.ssh/kidsbank_vps}"

if [[ ! -f "$SSH_KEY" ]]; then
  echo "SSH key not found: $SSH_KEY" >&2
  echo "Set KIDSBANK_SSH_KEY or create ~/.ssh/kidsbank_vps" >&2
  exit 1
fi

echo "→ npm ci"
npm ci

echo "→ npm run build"
npm run build

echo "→ rsync dist/ → ${USER}@${HOST}:${PATH_ON_SERVER}/"
rsync -avz --delete \
  -e "ssh -i \"$SSH_KEY\" -o StrictHostKeyChecking=accept-new" \
  dist/ "${USER}@${HOST}:${PATH_ON_SERVER}/"

echo "Done: https://62-113-106-19.sslip.io/"
