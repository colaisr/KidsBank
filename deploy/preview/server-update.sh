#!/usr/bin/env bash
# Optional: run ON THE VPS after one-time clone (see deploy/preview/README.md).
# Pulls main, builds, copies dist/ to nginx docroot.

set -euo pipefail

REPO_DIR="${KIDSBANK_REPO_DIR:-/opt/kidsbank/src}"
WEB_ROOT="${KIDSBANK_WEB_ROOT:-/var/www/kidsbank}"
BRANCH="${KIDSBANK_DEPLOY_BRANCH:-main}"

if [[ ! -d "$REPO_DIR/.git" ]]; then
  echo "Git repo missing: $REPO_DIR" >&2
  exit 1
fi

cd "$REPO_DIR"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

export NODE_ENV=production
# TypeScript 7 needs platform optional deps (@typescript/typescript-linux-x64 on VPS).
npm ci --include=optional
npm run build

rsync -av --delete dist/ "$WEB_ROOT/"

echo "Updated $WEB_ROOT from $BRANCH"
