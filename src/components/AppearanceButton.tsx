import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

type AppearanceButtonProps = {
  onGradient?: boolean;
};

export function AppearanceButton({ onGradient = false }: AppearanceButtonProps) {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <Link
      to="/child/profile"
      state={{ from: location.pathname }}
      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 ${
        onGradient
          ? 'bg-white/15 text-white hover:bg-white/25'
          : 'bg-surface-muted text-primary hover:bg-primary/10'
      }`}
      aria-label={t('ui.app.appearance')}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3C7.03 3 3 6.92 3 11.73c0 2.2 1.05 4.16 2.7 5.45.55.42.9 1.07.9 1.82 0 .55-.45 1-1 1h-.25C4.01 20 2 17.99 2 15.55 2 9.6 6.48 5 12 5s10 4.6 10 10.55c0 2.44-2.01 4.45-4.35 4.45H16c-.55 0-1-.45-1-1 0-.75.35-1.4.9-1.82C17.95 15.89 19 13.93 19 11.73 19 6.92 14.97 3 12 3Z"
          fill="currentColor"
        />
        <circle cx="7.5" cy="11" r="1.2" fill="currentColor" />
        <circle cx="10.5" cy="8" r="1.2" fill="currentColor" />
        <circle cx="14.5" cy="8.5" r="1.2" fill="currentColor" />
        <circle cx="16.5" cy="12" r="1.2" fill="currentColor" />
      </svg>
    </Link>
  );
}
