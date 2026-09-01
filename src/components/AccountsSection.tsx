import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PresenterBadgeWithSheet } from './PresenterBadgeWithSheet';
import { usePreferences } from '../context/PreferencesContext';
import { useDemoState } from '../context/DemoStateContext';
import { formatCurrency, formatNumber } from '../lib/format';

export function AccountsSection() {
  const { t } = useTranslation();
  const { locale, bank } = usePreferences();
  const { demo } = useDemoState();
  const productName =
    bank === 'amio' ? t('ui.home.productAmio') : t('ui.home.productEvoca');

  return (
    <section>
      <div className="mb-3 flex items-center gap-1.5">
        <h2 className="font-heading text-base font-semibold text-text">{t('ui.home.accounts')}</h2>
        <PresenterBadgeWithSheet presenterId="child-accounts" variant="compact" />
      </div>
      <Link
        to="/child/card-design"
        className="kb-pay-card block rounded-card px-5 py-5 shadow-lg transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
        aria-label={t('ui.cardDesign.title')}
      >
        <div className="relative z-10 flex items-start justify-between">
          <CardChipIcon />
          <span className="text-lg text-accent-kids" aria-hidden="true">
            ★
          </span>
        </div>
        <p className="relative z-10 mt-4 font-heading text-sm font-semibold tracking-wide text-white/90">
          {productName}
        </p>
        <p className="relative z-10 mt-1 font-medium tracking-[0.12em] text-white/80">
          {t('ui.card.masked', { last4: demo.card.last4 })}
        </p>
        <p className="relative z-10 mt-4 font-heading text-3xl font-semibold tracking-tight">
          {formatCurrency(demo.card.balance, locale, 'AMD', 2)}
        </p>
        {demo.cardLimit !== null ? (
          <p className="relative z-10 mt-2 text-xs font-medium text-white/80">
            {t('ui.card.limit', { amount: formatCurrency(demo.cardLimit, locale) })}
          </p>
        ) : null}
        <span className="kb-card-mark" aria-hidden="true" />
      </Link>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Link
          to="/child/piggy"
          className="min-w-0 rounded-card border border-border bg-surface p-4 transition-colors duration-200 hover:border-primary/40"
        >
          <PiggyIcon />
          <p className="mt-2 text-xs font-medium text-text-muted">{t('ui.home.piggy')}</p>
          <p className="mt-1 truncate font-heading text-lg font-semibold text-text">
            {formatCurrency(demo.piggy.balance, locale)}
          </p>
        </Link>
        <Link
          to="/child/goals"
          className="min-w-0 rounded-card border border-border bg-surface p-4 transition-colors duration-200 hover:border-primary/40"
        >
          <span className="text-lg text-accent-kids" aria-hidden="true">
            ★
          </span>
          <p className="mt-2 text-xs font-medium text-text-muted">{t('ui.home.stars')}</p>
          <p className="mt-1 font-heading text-lg font-semibold text-text">
            {formatNumber(demo.starsBalance, locale)}
          </p>
        </Link>
      </div>
    </section>
  );
}

function CardChipIcon() {
  return (
    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="26" height="18" rx="4" stroke="white" strokeOpacity="0.7" strokeWidth="1.5" />
      <rect x="4" y="6" width="8" height="5" rx="1" fill="white" fillOpacity="0.85" />
    </svg>
  );
}

function PiggyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-primary">
      <path
        d="M16 8.2c.4-.3.7-.8.7-1.4 0-.9-.8-1.6-1.7-1.6-.5 0-1 .2-1.3.6C13.2 5.3 12.6 5 12 5c-3.4 0-6.2 2.5-6.8 5.8H4.5A1.5 1.5 0 0 0 3 12.3V14a1 1 0 0 0 1 1h.6c.4 1.8 1.8 3.3 3.6 4v1.2a.8.8 0 0 0 .8.8h1.2a.8.8 0 0 0 .8-.8V19h2.2v1.2a.8.8 0 0 0 .8.8h1.2a.8.8 0 0 0 .8-.8V19c1.5-.6 2.6-1.8 3.2-3.3.8-.2 1.8-1.1 1.8-2.4 0-1-.6-1.8-1.4-2.2V11c0-1.2-.8-2.2-1.8-2.8Z"
        fill="currentColor"
      />
    </svg>
  );
}
