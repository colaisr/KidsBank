import http from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8091);
const POLZA_API_KEY = process.env.POLZA_API_KEY;
const POLZA_MODEL = process.env.POLZA_MODEL || 'gemini-3.5-flash-lite';
const POLZA_BASE_URL = (process.env.POLZA_BASE_URL || 'https://api.polza.ai/v1').replace(/\/$/, '');

const SYSTEM_PROMPT = readFileSync(path.join(__dirname, 'leo-system-prompt.txt'), 'utf8');

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function handleChat(messages) {
  if (!POLZA_API_KEY) {
    throw new Error('POLZA_API_KEY is not configured');
  }

  const response = await fetch(`${POLZA_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${POLZA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: POLZA_MODEL,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 400,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const message = data?.error?.message || `Polza HTTP ${response.status}`;
    throw new Error(message);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('Empty model response');
  }

  return content.trim();
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    sendJson(res, 200, { ok: true, model: POLZA_MODEL, hasKey: Boolean(POLZA_API_KEY) });
    return;
  }

  if (req.method === 'POST' && req.url === '/leo/chat') {
    try {
      const raw = await readBody(req);
      const body = JSON.parse(raw || '{}');
      const messages = Array.isArray(body.messages) ? body.messages : [];
      const sanitized = messages
        .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

      if (sanitized.length === 0 || sanitized[sanitized.length - 1].role !== 'user') {
        sendJson(res, 400, { error: 'Last message must be from user' });
        return;
      }

      const reply = await handleChat(sanitized);
      sendJson(res, 200, { reply });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Chat failed';
      sendJson(res, 502, { error: message });
    }
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

const HOST = process.env.HOST || '0.0.0.0';
server.listen(PORT, HOST, () => {
  console.log(`leo-chat listening on ${HOST}:${PORT}`);
});
