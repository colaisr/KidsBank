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
      <SettingsIcon />
    </Link>
  );
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M19.4 13.5a7.4 7.4 0 0 0 .1-3l2-1.1-2-3.5-2.3.6a7.5 7.5 0 0 0-2.6-1.5L14.5 2h-5l-.1 2.9a7.5 7.5 0 0 0-2.6 1.5l-2.3-.6-2 3.5 2 1.1a7.4 7.4 0 0 0 0 3l-2 1.1 2 3.5 2.3-.6a7.5 7.5 0 0 0 2.6 1.5l.1 2.9h5l.1-2.9a7.5 7.5 0 0 0 2.6-1.5l2.3.6 2-3.5-2-1.1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}
