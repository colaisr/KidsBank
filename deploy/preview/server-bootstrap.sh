#!/usr/bin/env bash
# One-time VPS setup: Node 22, git, GitHub deploy key, clone KidsBank.
# Run ON THE SERVER as root (or with sudo).

set -euo pipefail

REPO_DIR="${KIDSBANK_REPO_DIR:-/opt/kidsbank/src}"
REPO_SSH="git@github.com:colaisr/KidsBank.git"
DEPLOY_KEY="/root/.ssh/kidsbank_github_deploy"

if ! command -v git >/dev/null; then
  apt-get update
  apt-get install -y git ca-certificates curl
fi

if ! command -v node >/dev/null || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt 22 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

node -v
npm -v

if [[ ! -f "$DEPLOY_KEY" ]]; then
  ssh-keygen -t ed25519 -f "$DEPLOY_KEY" -N "" -C "kidsbank-vps-deploy"
  echo ""
  echo "Add this deploy key to GitHub → KidsBank → Settings → Deploy keys (read-only):"
  cat "${DEPLOY_KEY}.pub"
  echo ""
  echo "Then re-run bootstrap or: git clone manually."
  exit 2
fi

mkdir -p /root/.ssh
chmod 700 /root/.ssh
if ! grep -q 'Host github.com' /root/.ssh/config 2>/dev/null; then
  cat >> /root/.ssh/config <<EOF

Host github.com
  IdentityFile ${DEPLOY_KEY}
  IdentitiesOnly yes
EOF
  chmod 600 /root/.ssh/config
fi

mkdir -p "$(dirname "$REPO_DIR")"
if [[ ! -d "$REPO_DIR/.git" ]]; then
  GIT_SSH_COMMAND="ssh -i ${DEPLOY_KEY} -o IdentitiesOnly=yes" \
    git clone "$REPO_SSH" "$REPO_DIR"
fi

chmod +x "$REPO_DIR/deploy/preview/server-update.sh"
echo "Bootstrap OK. Deploy with: $REPO_DIR/deploy/preview/server-update.sh"
