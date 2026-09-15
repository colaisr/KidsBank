import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { demoChild } from '../../data/children';
import { useDemoState } from '../../context/DemoStateContext';
import { usePreferences } from '../../context/PreferencesContext';
import { formatNumber } from '../../lib/format';

export function YoungChildHomeHeader() {
  const { t } = useTranslation();
  const location = useLocation();
  const { demo } = useDemoState();
  const { locale } = usePreferences();
  const childName = t(`demo.${demoChild.id}.name`);

  return (
    <header
      className="px-4 pb-5 pt-3 text-white"
      style={{ background: 'var(--kb-header-gradient)' }}
    >
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/child/profile"
          state={{ from: location.pathname }}
          className="flex min-w-0 items-center gap-2.5 rounded-2xl py-1 pr-2 transition-opacity hover:opacity-95"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 font-heading text-lg font-semibold">
            {demoChild.avatarLetter}
          </span>
          <span className="truncate font-heading text-lg font-semibold">{childName}</span>
        </Link>
        <div
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 font-heading text-sm font-semibold text-text shadow-sm"
          aria-label={t('ui.home.stars')}
        >
          <span className="text-accent-kids" aria-hidden="true">★</span>
          <span>{formatNumber(demo.starsBalance, locale)}</span>
        </div>
      </div>
    </header>
  );
}
