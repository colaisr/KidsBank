import { useTranslation } from 'react-i18next';
import { useDemoState } from '../context/DemoStateContext';
import { usePreferences } from '../context/PreferencesContext';
import { STAR_ALLOCATE_STEP } from '../data/starEconomy';
import { formatNumber } from '../lib/format';

export function StarsWalletCard() {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo } = useDemoState();

  return (
    <article className="relative overflow-hidden rounded-card border border-accent-kids/25 bg-accent-kids/10 px-5 py-4">
      <span
        className="pointer-events-none absolute -right-2 -top-3 text-7xl leading-none text-accent-kids/15"
        aria-hidden="true"
      >
        ★
      </span>
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        {t('ui.goals.availableStars')}
      </p>
      <p className="relative mt-1 flex items-baseline gap-1.5 font-heading text-4xl font-semibold tracking-tight text-text">
        {formatNumber(demo.starsBalance, locale)}
        <span className="text-2xl text-accent-kids" aria-hidden="true">
          ★
        </span>
      </p>
      <p className="relative mt-1 text-sm text-text-muted">
        {t('ui.goals.availableHint', { count: formatNumber(STAR_ALLOCATE_STEP, locale) })}
      </p>
    </article>
  );
}
