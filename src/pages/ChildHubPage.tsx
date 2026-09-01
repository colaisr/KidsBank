import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChildPageTitle } from '../components/ChildPageTitle';
import { demoSpend, transferChildToParent } from '../context/demoActions';
import { useDemoState } from '../context/DemoStateContext';
import { usePreferences } from '../context/PreferencesContext';
import { formatCurrency } from '../lib/format';

const HUB_LINKS = [
  { to: '/child/profile', key: 'profile' },
  { to: '/appearance', key: 'appearance' },
  { to: '/child/tasks', key: 'tasks' },
  { to: '/child/goals', key: 'goals' },
] as const;

const DEMO_SPEND = 600;
const TRANSFER_TO_PARENT = 200;

type DemoFeedback = 'spend' | 'transfer' | 'limit' | 'insufficient' | null;

export function ChildHubPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const { locale } = usePreferences();
  const { demo, setDemo } = useDemoState();
  const [feedback, setFeedback] = useState<DemoFeedback>(null);

  useEffect(() => {
    if (!feedback) {
      return;
    }
    const timer = window.setTimeout(() => setFeedback(null), 3500);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  function handleDemoSpend() {
    if (demo.card.balance < DEMO_SPEND) {
      setFeedback('insufficient');
      return;
    }

    const result = demoSpend(demo, DEMO_SPEND);
    if (result === 'limit') {
      setFeedback('limit');
      return;
    }

    setDemo(result);
    setFeedback('spend');
  }

  function handleTransferToParent() {
    setDemo((s) => transferChildToParent(s, TRANSFER_TO_PARENT));
    setFeedback('transfer');
  }

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <ChildPageTitle titleKey="ui.nav.hub" presenterId="child-hub" />
      <div className="space-y-4 px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {HUB_LINKS.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              state={item.to === '/child/profile' ? { from: location.pathname } : undefined}
              className="rounded-card border border-border bg-surface px-4 py-5 text-center font-heading text-sm font-semibold text-text transition-colors duration-200 hover:border-primary/40"
            >
              {t(`ui.hub.${item.key}`)}
            </Link>
          ))}
        </div>

        <section className="rounded-card border border-border bg-surface p-4">
          <h2 className="font-heading text-sm font-semibold text-text">{t('ui.hub.demoActions')}</h2>
          <p className="mt-1 text-xs text-text-muted">{t('ui.hub.demoHint')}</p>
          <p className="mt-2 font-heading text-lg font-semibold text-text">
            {t('ui.hub.cardBalance', {
              amount: formatCurrency(demo.card.balance, locale, 'AMD', 2),
            })}
          </p>
          {demo.cardLimit !== null ? (
            <p className="mt-1 text-xs font-medium text-primary">
              {t('ui.card.limit', { amount: formatCurrency(demo.cardLimit, locale) })}
            </p>
          ) : null}

          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleDemoSpend}
              disabled={demo.card.balance < DEMO_SPEND}
              className="rounded-full border border-border py-2.5 text-sm font-semibold text-text transition-colors duration-200 hover:border-primary/40 disabled:opacity-50"
            >
              {t('ui.hub.demoSpend', { amount: formatCurrency(DEMO_SPEND, locale) })}
            </button>
            <button
              type="button"
              onClick={handleTransferToParent}
              disabled={demo.card.balance < TRANSFER_TO_PARENT}
              className="rounded-full border border-border py-2.5 text-sm font-semibold text-text transition-colors duration-200 hover:border-primary/40 disabled:opacity-50"
            >
              {t('ui.hub.sendToParent', {
                amount: formatCurrency(TRANSFER_TO_PARENT, locale),
              })}
            </button>
          </div>

          {feedback === 'spend' ? (
            <ActionBanner tone="success">
              {t('ui.hub.spendDone', { amount: formatCurrency(DEMO_SPEND, locale) })}
            </ActionBanner>
          ) : null}
          {feedback === 'transfer' ? (
            <ActionBanner tone="success">
              {t('ui.hub.transferDone', {
                amount: formatCurrency(TRANSFER_TO_PARENT, locale),
              })}
            </ActionBanner>
          ) : null}
          {feedback === 'limit' ? (
            <ActionBanner tone="error">{t('ui.limit.blocked')}</ActionBanner>
          ) : null}
          {feedback === 'insufficient' ? (
            <ActionBanner tone="error">{t('ui.hub.insufficient')}</ActionBanner>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function ActionBanner({
  tone,
  children,
}: {
  tone: 'success' | 'error';
  children: React.ReactNode;
}) {
  const isSuccess = tone === 'success';

  return (
    <p
      role="status"
      className={`mt-3 flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${
        isSuccess
          ? 'border-primary/30 bg-primary/10 text-primary'
          : 'border-accent-secondary/30 bg-accent-secondary/10 text-accent-secondary'
      }`}
    >
      <span aria-hidden="true">{isSuccess ? '✓' : '!'}</span>
      {children}
    </p>
  );
}
