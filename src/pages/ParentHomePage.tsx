import { useTranslation } from 'react-i18next';
import { ParentChildHeader } from '../components/ParentChildHeader';
import { ParentServiceRow } from '../components/ParentServiceRow';
import { useDemoState } from '../context/DemoStateContext';
import { useParentLocation } from '../context/ParentLocationContext';
import { usePreferences } from '../context/PreferencesContext';
import { formatCurrency } from '../lib/format';
import { countTasksWaitingParent } from '../lib/tasks';

export function ParentHomePage() {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo, setDemo } = useDemoState();

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
      <div className="text-white" style={{ background: 'var(--kb-header-gradient)' }}>
        <ParentChildHeader
          variant="hero"
          children={demo.children}
          activeChildId={demo.activeChildId}
          onSelectChild={(childId) => setDemo((s) => ({ ...s, activeChildId: childId }))}
        />

        <div className="px-4 pb-3.5 pt-1">
          <div className="rounded-card border border-white/20 bg-white/10 px-3.5 py-3 backdrop-blur-sm">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-medium leading-tight text-white/70">
                  {t('ui.parent.childBalance')}
                </p>
                <p className="mt-0.5 font-heading text-xl font-semibold leading-tight tracking-tight">
                  {formatCurrency(demo.card.balance, locale, 'AMD', 2)}
                </p>
              </div>
              <p className="shrink-0 text-right text-[11px] font-medium leading-snug text-white/80">
                {t('ui.parent.piggyBalance', {
                  amount: formatCurrency(demo.piggy.balance, locale),
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="bg-surface-muted px-4 pb-4 pt-3">
        <section>
          <h2 className="mb-2 font-heading text-sm font-semibold text-text">
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
