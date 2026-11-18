# Leo chat proxy (KidsBank young totem)

Small server-side proxy to Polza.ai. **Never commit `.env`** with the API key.

On VPS: `/opt/kidsbank/leo-chat/` with `.env` from `.env.example`.

Nginx: `location /api/kidsbank/` → `http://127.0.0.1:8091/`.

Health (on VPS): `curl -s http://127.0.0.1:8091/health` → `ok`, `hasKey: true`

Prod (through nginx): `https://82-202-128-45.sslip.io/api/kidsbank/leo/chat` — `POST` JSON `{"messages":[{"role":"user","content":"…"}]}` → `{"reply":"…"}`.
