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

function appendDraft(prev: string, chunk: string): string {
  const next = chunk.trim();
  if (!next) {
    return prev;
  }
  if (!prev.trim()) {
    return next;
  }
  return `${prev.trimEnd()} ${next}`;
}

export function YoungLeoChat() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<LeoChatMessage[]>(() => [
    { role: 'assistant', content: t('ui.childYoung.totem.chat.greeting') },
  ]);
  const [draft, setDraft] = useState('');
  const [dictationPreview, setDictationPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const dictationPreviewRef = useRef('');

  useEffect(() => {
    dictationPreviewRef.current = dictationPreview;
  }, [dictationPreview]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  function flushDictationPreviewToDraft() {
    const interim = dictationPreviewRef.current.trim();
    if (interim) {
      setDraft((prev) => appendDraft(prev, interim));
    }
    setDictationPreview('');
    dictationPreviewRef.current = '';
  }

  function stopDictation() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  }

  async function submitText(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) {
      return;
    }

    if (listening) {
      stopDictation();
      flushDictationPreviewToDraft();
    }

    setError(null);
    const nextMessages: LeoChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setDraft('');
    setDictationPreview('');
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
      stopDictation();
      return;
    }

    const recognition = new Ctor();
    recognition.lang = 'ru-RU';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const part = event.results[i][0]?.transcript ?? '';
        if (event.results[i].isFinal) {
          finalText += part;
        } else {
          interim += part;
        }
      }
      if (finalText) {
        setDraft((prev) => appendDraft(prev, finalText));
      }
      setDictationPreview(interim);
      dictationPreviewRef.current = interim;
    };

    recognition.onerror = () => {
      flushDictationPreviewToDraft();
      setListening(false);
      recognitionRef.current = null;
      setError(t('ui.childYoung.totem.chat.dictationError'));
    };

    recognition.onend = () => {
      flushDictationPreviewToDraft();
      setListening(false);
      recognitionRef.current = null;
    };

    setError(null);
    setDictationPreview('');
    dictationPreviewRef.current = '';
    setListening(true);
    recognition.start();
  }

  const showDictationBubble = listening || dictationPreview.length > 0;

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

      <div className="shrink-0 border-t border-border">
        {showDictationBubble ? (
          <div className="px-3 pb-1 pt-2.5" aria-live="polite" aria-atomic="true">
            <div className="relative ml-1 max-w-[92%]">
              <div
                className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ring-1 ${
                  listening
                    ? 'bg-orange-50 text-text ring-orange-200/80'
                    : 'bg-surface-muted text-text ring-border'
                }`}
              >
                {dictationPreview ? (
                  <span>{dictationPreview}</span>
                ) : (
                  <span className="text-text-muted">{t('ui.childYoung.totem.chat.dictationListening')}</span>
                )}
                {listening ? (
                  <span className="ml-1 inline-block h-2 w-2 animate-pulse rounded-full bg-orange-500 align-middle" />
                ) : null}
              </div>
              <span
                className="absolute -bottom-1.5 left-5 h-3 w-3 rotate-45 bg-orange-50 ring-1 ring-orange-200/80"
                aria-hidden="true"
              />
            </div>
          </div>
        ) : null}

        <div className="flex items-end gap-2 px-3 py-2.5">
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
          <textarea
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitText(draft);
              }
            }}
            placeholder={t('ui.childYoung.totem.chat.placeholder')}
            className="min-h-[2.75rem] max-h-24 min-w-0 flex-1 resize-none rounded-2xl border border-border bg-surface-muted px-3 py-2 text-sm leading-snug text-text outline-none focus:border-primary/40"
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
