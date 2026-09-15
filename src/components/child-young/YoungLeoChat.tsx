import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sendLeoChat, type LeoChatMessage } from '../../lib/leoChatApi';

type SpeechRecognitionCtor = new () => SpeechRecognition;

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const QUICK_REPLY_KEYS = ['countDays', 'whatIsPiggy'] as const;

export function YoungLeoChat() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<LeoChatMessage[]>(() => [
    { role: 'assistant', content: t('ui.childYoung.totem.chat.greeting') },
  ]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function submitText(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) {
      return;
    }

    setError(null);
    const nextMessages: LeoChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setDraft('');
    setLoading(true);

    try {
      const reply = await sendLeoChat(nextMessages);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setError(t('ui.childYoung.totem.chat.error'));
      setMessages((prev) => prev.slice(0, -1));
      setDraft(trimmed);
    } finally {
      setLoading(false);
    }
  }

  function startDictation() {
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      setError(t('ui.childYoung.totem.chat.dictationUnsupported'));
      return;
    }

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new Ctor();
    recognition.lang = 'ru-RU';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    let interim = '';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = '';
      interim = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const part = event.results[i][0]?.transcript ?? '';
        if (event.results[i].isFinal) {
          finalText += part;
        } else {
          interim += part;
        }
      }
      if (finalText) {
        setDraft((prev) => `${prev}${prev ? ' ' : ''}${finalText}`.trim());
      } else if (interim) {
        setDraft((prev) => {
          const base = prev.replace(/\s+$/, '');
          return `${base}${base ? ' ' : ''}${interim}`.trim();
        });
      }
    };

    recognition.onerror = () => {
      setListening(false);
      setError(t('ui.childYoung.totem.chat.dictationError'));
    };

    recognition.onend = () => {
      setListening(false);
    };

    setError(null);
    setListening(true);
    recognition.start();
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-t-3xl border border-border bg-surface shadow-[0_-4px_24px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-lg">
          🦁
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface bg-emerald-500" />
        </span>
        <div className="min-w-0">
          <p className="font-heading text-sm font-semibold text-text">{t('ui.childYoung.totem.leoName')}</p>
          <p className="text-xs font-medium text-emerald-600">{t('ui.childYoung.totem.chat.online')}</p>
        </div>
      </div>

      <div ref={listRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3">
        {messages.map((message, index) => (
          <div
            key={`${index}-${message.role}`}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <p
              className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-sky-50 text-text ring-1 ring-sky-100'
              }`}
            >
              {message.content}
            </p>
          </div>
        ))}
        {loading ? (
          <p className="text-xs text-text-muted">{t('ui.childYoung.totem.chat.typing')}</p>
        ) : null}
      </div>

      {!loading && messages.length === 1 ? (
        <div className="flex flex-wrap gap-2 px-3 pb-2">
          {QUICK_REPLY_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => submitText(t(`ui.childYoung.totem.chat.quick.${key}`))}
              className="rounded-full border border-primary/30 bg-surface px-3 py-1.5 text-xs font-semibold text-primary"
            >
              {t(`ui.childYoung.totem.chat.quick.${key}`)}
            </button>
          ))}
        </div>
      ) : null}

      {error ? (
        <p className="px-3 pb-1 text-center text-xs font-medium text-red-600" role="alert">{error}</p>
      ) : null}

      <div className="flex items-center gap-2 border-t border-border px-3 py-2.5">
        <button
          type="button"
          onClick={startDictation}
          aria-pressed={listening}
          aria-label={t('ui.childYoung.totem.chat.dictation')}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
            listening ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700'
          }`}
        >
          <MicIcon active={listening} />
        </button>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submitText(draft);
            }
          }}
          placeholder={t('ui.childYoung.totem.chat.placeholder')}
          className="min-w-0 flex-1 rounded-full border border-border bg-surface-muted px-4 py-2.5 text-sm text-text outline-none focus:border-primary/40"
        />
        <button
          type="button"
          disabled={loading || !draft.trim()}
          onClick={() => submitText(draft)}
          aria-label={t('ui.childYoung.totem.chat.send')}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white disabled:opacity-45"
        >
          <SendIcon />
        </button>
      </div>
    </section>
  );
}

function MicIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="4" width="6" height="11" rx="3" fill="currentColor" opacity={active ? 1 : 0.9} />
      <path d="M6 11a6 6 0 0012 0M12 17v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h12M13 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
