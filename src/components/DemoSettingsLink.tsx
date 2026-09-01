import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

type DemoSettingsLinkProps = {
  onGradient?: boolean;
};

export function DemoSettingsLink({ onGradient = false }: DemoSettingsLinkProps) {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <Link
      to="/child/profile"
      state={{ from: location.pathname }}
      className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-colors duration-200 ${
        onGradient
          ? 'bg-white/15 text-white hover:bg-white/25'
          : 'bg-surface-muted text-primary hover:bg-primary/10'
      }`}
      aria-label={t('ui.app.settings')}
    >
      <ChatIcon />
    </Link>
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
