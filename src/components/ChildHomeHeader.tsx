import { useTranslation } from 'react-i18next';

export function ChildHomeHeader() {
  const { t } = useTranslation();

  return (
    <header
      className="flex items-center justify-between gap-3 px-4 pb-4 pt-3 text-white"
      style={{ background: 'var(--kb-header-gradient)' }}
    >
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white"
        aria-label={t('ui.home.stars')}
      >
        <StarIcon />
      </button>
      <h1 className="font-heading text-lg font-semibold">{t('ui.home.title')}</h1>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white"
        aria-label={t('ui.home.chat')}
      >
        <ChatIcon />
      </button>
    </header>
  );
}

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.9 6.5 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7-5.4-4.7 7.1-.6L12 2.5Z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 18.5V7.8A2.8 2.8 0 0 1 7.8 5h8.4A2.8 2.8 0 0 1 19 7.8v5.4A2.8 2.8 0 0 1 16.2 16H9l-4 2.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}
