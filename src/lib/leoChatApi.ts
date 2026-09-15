export type LeoChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const CHAT_PATH = '/api/kidsbank/leo/chat';

export async function sendLeoChat(messages: LeoChatMessage[]): Promise<string> {
  const response = await fetch(CHAT_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  const data = (await response.json()) as { reply?: string; error?: string };
  if (!response.ok) {
    throw new Error(data.error || 'chat_failed');
  }
  if (!data.reply) {
    throw new Error('empty_reply');
  }
  return data.reply;
}
