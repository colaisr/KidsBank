import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { demoPhoneTopUp } from '../../context/demoActions';
import { useDemoState } from '../../context/DemoStateContext';
import { usePreferences } from '../../context/PreferencesContext';
import {
  DEFAULT_YOUNG_PHONE_TOPUP_AMOUNT,
  YOUNG_PHONE_TOPUP_AMOUNTS,
  type YoungPhoneTopupAmount,
} from '../../data/youngPhoneTopup';
import { formatCurrency, formatNumber } from '../../lib/format';

type TopUpError = 'limit' | 'insufficient' | null;

export function YoungChildPhoneTopUpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { locale } = usePreferences();
  const { demo, setDemo } = useDemoState();
  const [amount, setAmount] = useState<YoungPhoneTopupAmount>(DEFAULT_YOUNG_PHONE_TOPUP_AMOUNT);
  const [error, setError] = useState<TopUpError>(null);

  function handleTopUp() {
    setError(null);
    const result = demoPhoneTopUp(demo, amount);
    if (result === 'limit') {
      setError('limit');
      return;
    }
    if (result === 'insufficient') {
      setError('insufficient');
      return;
    }
    setDemo(result);
    navigate('/child');
  }

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <header className="border-b border-border bg-surface px-4 pb-4 pt-3">
        <div className="flex items-center gap-3">
          <Link
            to="/child"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-primary"
            aria-label={t('ui.app.back')}
          >
            <span aria-hidden="true">←</span>
          </Link>
          <h1 className="min-w-0 flex-1 text-center font-heading text-lg font-semibold text-text pr-9">
            {t('ui.childYoung.phoneTopup.title')}
          </h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col px-4 py-5">
        <div className="flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3.5 shadow-sm">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
            aria-hidden="true"
          >
            <PhoneGlyph />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-text-muted">{t('ui.childYoung.phoneTopup.myNumber')}</p>
            <p className="font-heading text-base font-semibold text-text">
              {t('demo.child.david.phone')}
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-text-muted">{t('ui.childYoung.phoneTopup.amountLabel')}</p>
          <p className="mt-2 font-heading text-4xl font-bold tracking-tight text-text">
            {formatNumber(amount, locale)}
            <span className="ml-1 text-3xl font-semibold text-primary">֏</span>
          </p>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {YOUNG_PHONE_TOPUP_AMOUNTS.map((preset) => {
            const selected = amount === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setAmount(preset);
                  setError(null);
                }}
                className={`min-w-[5.5rem] rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  selected
                    ? 'border-primary/30 bg-primary/15 text-primary'
                    : 'border-border bg-surface text-text hover:border-primary/20'
                }`}
              >
                {formatCurrency(preset, locale)}
              </button>
            );
          })}
        </div>

        <div className="mt-auto space-y-3 pt-10">
          {error ? (
            <p className="text-center text-sm font-medium text-red-600" role="alert">
              {t(`ui.childYoung.phoneTopup.errors.${error}`)}
            </p>
          ) : null}
          <button
            type="button"
            onClick={handleTopUp}
            className="w-full rounded-full bg-primary py-3.5 font-heading text-base font-semibold text-white shadow-md transition-opacity hover:opacity-95"
          >
            {t('ui.childYoung.phoneTopup.cta')}
          </button>
        </div>
      </div>
    </div>
  );
}

function PhoneGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M10 6h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
