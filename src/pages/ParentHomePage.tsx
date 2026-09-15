import { useTranslation } from 'react-i18next';
import { useDemoState } from '../context/DemoStateContext';
import { usePreferences } from '../context/PreferencesContext';
import { formatCurrency } from '../lib/format';
import { countTasksWaitingParent } from '../lib/tasks';
import { ParentServiceRow } from '../components/ParentServiceRow';
import { useParentLocation } from '../context/ParentLocationContext';

export function ParentHomePage() {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo } = useDemoState();

  const { mode } = useParentLocation();
  const tasksAwaitingConfirm = countTasksWaitingParent(demo.tasks);
  const geolocationStatus =
    mode === 'live'
      ? t('ui.parent.geolocation.statusNeutral')
      : t('ui.parent.geolocation.statusFallback');
  const limitsStatus = demo.cashWithdrawal.enabled
    ? t('ui.parent.limitsStatusAtm', {
        amount: formatCurrency(demo.cashWithdrawal.dailyLimit, locale),
      })
    : t('ui.parent.limitNotSet');

  return (
    <>
      <div
        className="px-4 pb-6 pt-8 text-white"
        style={{ background: 'var(--kb-header-gradient)' }}
      >
        <p className="font-heading text-2xl font-semibold">{t('ui.shell.parentGreeting')}</p>
        <p className="mt-1 text-sm text-white/80">{t('ui.parent.subtitle')}</p>

        <div className="mt-5 rounded-card border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
          <p className="text-xs font-medium text-white/70">{t('ui.parent.childBalance')}</p>
          <p className="mt-1 font-heading text-3xl font-semibold">
            {formatCurrency(demo.card.balance, locale, 'AMD', 2)}
          </p>
          <p className="mt-1 text-sm text-white/80">
            {t('ui.parent.piggyBalance', {
              amount: formatCurrency(demo.piggy.balance, locale),
            })}
          </p>
        </div>
      </div>

      <main className="bg-surface-muted px-4 pb-8 pt-5">
        <section>
          <h2 className="mb-3 font-heading text-base font-semibold text-text">
            {t('ui.parent.services')}
          </h2>
          <div className="space-y-2">
            <ParentServiceRow
              to="/parent/geolocation"
              icon="📍"
              title={t('ui.parent.geolocation.rowTitle')}
              statusLabel={geolocationStatus}
              showLiveDot={mode === 'live'}
            />
            <ParentServiceRow
              to="/parent/transfer"
              icon="↗"
              title={t('ui.parent.transfer')}
              description={t('ui.parent.transferSubtitle')}
            />
            <ParentServiceRow
              to="/parent/limits"
              icon="✦"
              title={t('ui.parent.limitsRowTitle')}
              description={t('ui.parent.limitsSubtitle')}
              statusLabel={limitsStatus}
            />
            <ParentServiceRow
              to="/parent/tasks"
              icon="📋"
              title={t('ui.parent.tasksRowTitle')}
              badgeCount={tasksAwaitingConfirm}
            />
            <ParentServiceRow
              to="/parent/reports"
              icon="📊"
              title={t('ui.parent.reportsRowTitle')}
              description={t('ui.parent.reportsSubtitle')}
            />
            <ParentServiceRow
              to="/parent/spending-history"
              icon="🧾"
              title={t('ui.parent.spendingHistoryRowTitle')}
            />
            <ParentServiceRow
              to="/parent/goals"
              icon="★"
              title={t('ui.parent.goalsRowTitle')}
              description={t('ui.parent.goalsSubtitle')}
            />
          </div>
        </section>
      </main>
    </>
  );
}
