import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddGoalModal } from '../components/AddGoalModal';
import { ParentGoalRow } from '../components/ParentGoalRow';
import { TransactionRow } from '../components/TransactionRow';
import { useDemoState } from '../context/DemoStateContext';
import { usePreferences } from '../context/PreferencesContext';
import { formatCurrency } from '../lib/format';
import { getActiveGoals } from '../lib/goals';
import { countTasksWaitingParent } from '../lib/tasks';
import { ParentServiceRow } from '../components/ParentServiceRow';
import { useParentLocation } from '../context/ParentLocationContext';

const actionCardClass =
  'flex min-w-0 flex-col items-start rounded-card border border-border bg-surface p-3.5 text-left text-text shadow-sm transition-[colors,box-shadow,transform] duration-200 hover:border-primary/40 hover:shadow-md active:scale-[0.99]';

export function ParentHomePage() {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo } = useDemoState();
  const [addGoalOpen, setAddGoalOpen] = useState(false);

  const { mode } = useParentLocation();
  const activeGoals = getActiveGoals(demo.goals);
  const recentTx = demo.transactions.slice(0, 5);
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

      <main className="space-y-6 bg-surface-muted px-4 pb-8 pt-5">
        <section>
          <h2 className="mb-3 font-heading text-base font-semibold text-text">
            {t('ui.parent.quickActions')}
          </h2>
          <button type="button" onClick={() => setAddGoalOpen(true)} className={actionCardClass}>
            <span className="text-lg" aria-hidden="true">
              ★
            </span>
            <span className="mt-2 line-clamp-2 min-w-0 font-heading text-sm font-semibold">
              {t('ui.parent.addGoal')}
            </span>
          </button>
        </section>

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
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-heading text-base font-semibold text-text">
            {t('ui.parent.childGoals')}
          </h2>
          {activeGoals.length > 0 ? (
            <div className="space-y-2">
              {activeGoals.map((goal) => (
                <ParentGoalRow key={goal.id} goal={goal} />
              ))}
            </div>
          ) : (
            <div className="rounded-card border border-border bg-surface p-5">
              <p className="text-sm text-text-muted">{t('ui.parent.childGoalsEmpty')}</p>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 font-heading text-base font-semibold text-text">
            {t('ui.parent.spending')}
          </h2>
          {recentTx.length > 0 ? (
            <div className="space-y-2">
              {recentTx.map((tx) => (
                <TransactionRow key={tx.id} transaction={tx} />
              ))}
            </div>
          ) : (
            <div className="rounded-card border border-border bg-surface p-5">
              <p className="text-sm text-text-muted">{t('ui.transactions.empty')}</p>
            </div>
          )}
        </section>
      </main>

      <AddGoalModal open={addGoalOpen} onClose={() => setAddGoalOpen(false)} />
    </>
  );
}
