import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PresenterBadgeWithSheet } from '../components/PresenterBadgeWithSheet';
import { AddGoalModal } from '../components/AddGoalModal';
import { AddTaskModal } from '../components/AddTaskModal';
import { EditTaskModal } from '../components/EditTaskModal';
import { LimitModal } from '../components/LimitModal';
import { ParentGoalRow } from '../components/ParentGoalRow';
import { ParentTaskRow } from '../components/ParentTaskRow';
import { TransactionRow } from '../components/TransactionRow';
import { TransferModal } from '../components/TransferModal';
import type { DemoTaskState } from '../data/demoBaseline';
import { cancelTask, confirmTask } from '../context/demoActions';
import { useDemoState } from '../context/DemoStateContext';
import { usePreferences } from '../context/PreferencesContext';
import { formatCurrency } from '../lib/format';
import { getActiveGoals } from '../lib/goals';
import { getActiveTasksForParent } from '../lib/tasks';

export function ParentHomePage() {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo, setDemo } = useDemoState();
  const [transferOpen, setTransferOpen] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [addGoalOpen, setAddGoalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<DemoTaskState | null>(null);

  const activeTasks = getActiveTasksForParent(demo.tasks);
  const activeGoals = getActiveGoals(demo.goals);
  const recentTx = demo.transactions.slice(0, 5);

  function handleConfirm(taskId: string) {
    setDemo((s) => confirmTask(s, taskId));
  }

  function handleCancel(taskId: string) {
    setDemo((s) => cancelTask(s, taskId));
  }

  return (
    <main className="flex flex-1 flex-col px-4 py-6">
      <section className="rounded-card border border-border bg-surface p-5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium text-text-muted">{t('ui.parent.childBalance')}</p>
          <PresenterBadgeWithSheet presenterId="parent-home" variant="compact" />
        </div>
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
            onClick={() => setAddTaskOpen(true)}
            className="parent-action-card"
          >
            <span className="text-lg" aria-hidden="true">
              ✓
            </span>
            <span className="mt-2 font-heading text-sm font-semibold">{t('ui.parent.addTask')}</span>
          </button>
          <button
            type="button"
            onClick={() => setAddGoalOpen(true)}
            className="parent-action-card"
          >
            <span className="text-lg" aria-hidden="true">
              ★
            </span>
            <span className="mt-2 font-heading text-sm font-semibold">{t('ui.parent.addGoal')}</span>
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

      <section className="mt-5">
        <h2 className="mb-3 font-heading text-base font-semibold text-text">
          {t('ui.parent.childTasks')}
        </h2>
        {activeTasks.length > 0 ? (
          <div className="space-y-2">
            {activeTasks.map((task) => (
              <ParentTaskRow
                key={task.id}
                task={task}
                onConfirm={
                  task.statusId === 'waitingParent'
                    ? () => handleConfirm(task.id)
                    : undefined
                }
                onEdit={() => setEditingTask(task)}
                onCancel={() => handleCancel(task.id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-card border border-border bg-surface-muted p-5">
            <p className="text-sm text-text-muted">{t('ui.parent.childTasksEmpty')}</p>
          </div>
        )}
      </section>

      <section className="mt-5">
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
          <div className="rounded-card border border-border bg-surface-muted p-5">
            <p className="text-sm text-text-muted">{t('ui.parent.childGoalsEmpty')}</p>
          </div>
        )}
      </section>

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
      <AddTaskModal open={addTaskOpen} onClose={() => setAddTaskOpen(false)} />
      <AddGoalModal open={addGoalOpen} onClose={() => setAddGoalOpen(false)} />
      <EditTaskModal
        task={editingTask}
        open={editingTask !== null}
        onClose={() => setEditingTask(null)}
      />
    </main>
  );
}
