import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDemoState } from '../../context/DemoStateContext';
import { usePreferences } from '../../context/PreferencesContext';
import { formatCurrency, formatNumber } from '../../lib/format';

export function YoungAccountRows() {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo } = useDemoState();

  return (
    <div className="space-y-1.5">
      <Link
        to="/child/piggy"
        className="flex items-center gap-2.5 rounded-card border border-border bg-surface px-3 py-2.5 transition-colors hover:border-primary/30"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <PiggyIcon />
        </span>
        <span className="min-w-0 flex-1 font-heading text-sm font-semibold text-text">
          {t('ui.home.piggy')}
        </span>
        <span className="shrink-0 font-heading text-sm font-semibold text-text">
          {formatCurrency(demo.piggy.balance, locale)}
        </span>
      </Link>
      <Link
        to="/child/goals"
        className="flex items-center gap-2.5 rounded-card border border-border bg-surface px-3 py-2.5 transition-colors hover:border-primary/30"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-kids/20 text-base text-accent-kids-ink">
          ★
        </span>
        <span className="min-w-0 flex-1 font-heading text-sm font-semibold text-text">
          {t('ui.childYoung.home.starAccount')}
        </span>
        <span className="shrink-0 font-heading text-sm font-semibold text-text">
          {formatNumber(demo.starsBalance, locale)}
        </span>
      </Link>
    </div>
  );
}

function PiggyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M5 13c0-3.3 2.7-6 6-6h2c3.3 0 6 2.7 6 6v3H5v-3z" opacity="0.9" />
      <circle cx="9" cy="11" r="1" />
      <path d="M4 16h16v2H4z" />
    </svg>
  );
}
