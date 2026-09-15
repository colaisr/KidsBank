# Leo chat proxy (KidsBank young totem)

Small server-side proxy to Polza.ai. **Never commit `.env`** with the API key.

On VPS: `/opt/kidsbank/leo-chat/` with `.env` from `.env.example`.

Nginx: `location /api/kidsbank/` → `http://127.0.0.1:8091/`.

Health: `curl -s http://127.0.0.1:8091/health`
