import { useTranslation } from 'react-i18next';
import { useDemoState } from '../context/DemoStateContext';
import { usePreferences } from '../context/PreferencesContext';
import { formatNumber } from '../lib/format';
import { HeaderPresenterActions } from './HeaderPresenterActions';

export function ChildGoalsHeader() {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo } = useDemoState();

  return (
    <header
      className="rounded-b-3xl px-4 pb-4 pt-3 text-white shadow-md"
      style={{ background: 'var(--kb-header-gradient)' }}
    >
      <div className="flex items-center justify-between gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-200/90 text-amber-900"
          aria-hidden="true"
        >
          <StarIcon />
        </div>
        <h1 className="min-w-0 flex-1 text-center font-heading text-lg font-semibold">
          {t('ui.nav.goals')}
        </h1>
        <HeaderPresenterActions presenterId="child-goals" variant="onGradient" />
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 rounded-full bg-white/15 px-4 py-2.5 text-sm font-medium text-white">
        <span className="text-amber-200" aria-hidden="true">★</span>
        {t('ui.goals.starsBanner', {
          count: formatNumber(demo.starsBalance, locale),
        })}
      </p>
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
