import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LimitModal } from '../components/LimitModal';
import { TaskRow } from '../components/TaskRow';
import { TransactionRow } from '../components/TransactionRow';
import { TransferModal } from '../components/TransferModal';
import { confirmTask } from '../context/demoActions';
import { useDemoState } from '../context/DemoStateContext';
import { usePreferences } from '../context/PreferencesContext';
import { formatCurrency } from '../lib/format';

export function ParentHomePage() {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo, setDemo } = useDemoState();
  const [transferOpen, setTransferOpen] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);

  const pendingTasks = demo.tasks.filter((task) => task.statusId === 'waitingParent');
  const recentTx = demo.transactions.slice(0, 5);

  function handleConfirm(taskId: string) {
    setDemo((s) => confirmTask(s, taskId));
  }

  return (
    <main className="flex flex-1 flex-col px-4 py-6">
      <section className="rounded-card border border-border bg-surface p-5">
        <p className="text-xs font-medium text-text-muted">{t('ui.parent.childBalance')}</p>
        <p className="mt-1 font-heading text-2xl font-semibold text-text">
          {formatCurrency(demo.card.balance, locale, 'AMD', 2)}
        </p>
        <p className="mt-1 text-sm text-text-muted">
          {t('ui.parent.piggyBalance', {
            amount: formatCurrency(demo.piggy.balance, locale),
          })}
        </p>
      </section>

      <section className="mt-5">
        <h2 className="mb-3 font-heading text-base font-semibold text-text">
          {t('ui.parent.quickActions')}
        </h2>
        <div className="parent-quick-actions">
          <button
            type="button"
            onClick={() => setTransferOpen(true)}
            className="parent-action-card"
          >
            <span className="text-lg" aria-hidden="true">
              ↗
            </span>
            <span className="mt-2 font-heading text-sm font-semibold">{t('ui.parent.transfer')}</span>
          </button>
          <button
            type="button"
            onClick={() => setLimitOpen(true)}
            className={`parent-action-card ${
              demo.cardLimit !== null ? 'border-primary/40 bg-primary/5 ring-1 ring-primary/20' : ''
            }`}
          >
            <span className="text-lg" aria-hidden="true">
              ⏱
            </span>
            <div className="parent-action-card-text">
              <span className="font-heading text-sm font-semibold">{t('ui.parent.limit')}</span>
              <span
                className={`mt-0.5 block text-xs font-medium ${
                  demo.cardLimit !== null ? 'text-primary' : 'text-text-muted'
                }`}
              >
                {demo.cardLimit !== null
                  ? t('ui.parent.limitActive', {
                      amount: formatCurrency(demo.cardLimit, locale),
                    })
                  : t('ui.parent.limitNotSet')}
              </span>
            </div>
          </button>
        </div>
      </section>

      {pendingTasks.length > 0 ? (
        <section className="mt-5">
          <h2 className="mb-3 font-heading text-base font-semibold text-text">
            {t('ui.parent.pendingTasks')}
          </h2>
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <div key={task.id} className="space-y-2">
                <TaskRow task={task} interactive={false} />
                <button
                  type="button"
                  onClick={() => handleConfirm(task.id)}
                  className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white"
                >
                  {t('ui.parent.confirmTask')}
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-5">
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
          <div className="rounded-card border border-border bg-surface-muted p-5">
            <p className="text-sm text-text-muted">{t('ui.transactions.empty')}</p>
          </div>
        )}
      </section>

      <TransferModal open={transferOpen} onClose={() => setTransferOpen(false)} />
      <LimitModal open={limitOpen} onClose={() => setLimitOpen(false)} />
    </main>
  );
}
