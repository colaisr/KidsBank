import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HeaderPresenterActions } from './HeaderPresenterActions';

export function ChildHomeHeader() {
  const { t } = useTranslation();

  return (
    <header
      className="flex items-center justify-between gap-3 px-4 pb-4 pt-3 text-white"
      style={{ background: 'var(--kb-header-gradient)' }}
    >
      <Link
        to="/child/goals"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white transition-colors duration-200 hover:bg-white/25"
        aria-label={t('ui.home.stars')}
      >
        <StarIcon />
      </Link>
      <h1 className="min-w-0 flex-1 text-center font-heading text-lg font-semibold">
        {t('ui.home.title')}
      </h1>
      <HeaderPresenterActions presenterId="child-home" variant="onGradient" />
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
