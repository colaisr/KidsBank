import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddGoalModal } from '../components/AddGoalModal';
import { AddTaskModal } from '../components/AddTaskModal';
import { EditTaskModal } from '../components/EditTaskModal';
import { LimitModal } from '../components/LimitModal';
import { ParentGoalRow } from '../components/ParentGoalRow';
import { ParentTaskRow } from '../components/ParentTaskRow';
import { TransactionRow } from '../components/TransactionRow';
import type { DemoTaskState } from '../data/demoBaseline';
import { cancelTask, confirmTask } from '../context/demoActions';
import { useDemoState } from '../context/DemoStateContext';
import { usePreferences } from '../context/PreferencesContext';
import { formatCurrency } from '../lib/format';
import { getActiveGoals } from '../lib/goals';
import { getActiveTasksForParent } from '../lib/tasks';
import { ParentServiceRow } from '../components/ParentServiceRow';
import { useParentLocation } from '../context/ParentLocationContext';

const actionCardClass =
  'flex min-w-0 flex-col items-start rounded-card border border-border bg-surface p-3.5 text-left text-text shadow-sm transition-[colors,box-shadow,transform] duration-200 hover:border-primary/40 hover:shadow-md active:scale-[0.99]';

export function ParentHomePage() {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo, setDemo } = useDemoState();
  const [limitOpen, setLimitOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [addGoalOpen, setAddGoalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<DemoTaskState | null>(null);

  const { mode } = useParentLocation();
  const activeTasks = getActiveTasksForParent(demo.tasks);
  const activeGoals = getActiveGoals(demo.goals);
  const recentTx = demo.transactions.slice(0, 5);
  const geolocationStatus =
    mode === 'live'
      ? t('ui.parent.geolocation.statusNeutral')
      : t('ui.parent.geolocation.statusFallback');

  function handleConfirm(taskId: string) {
    setDemo((s) => confirmTask(s, taskId));
  }

  function handleCancel(taskId: string) {
    setDemo((s) => cancelTask(s, taskId));
  }

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
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setAddTaskOpen(true)} className={actionCardClass}>
              <span className="text-lg" aria-hidden="true">
                ✓
              </span>
              <span className="mt-2 line-clamp-2 min-w-0 font-heading text-sm font-semibold">
                {t('ui.parent.addTask')}
              </span>
            </button>
            <button type="button" onClick={() => setAddGoalOpen(true)} className={actionCardClass}>
              <span className="text-lg" aria-hidden="true">
                ★
              </span>
              <span className="mt-2 line-clamp-2 min-w-0 font-heading text-sm font-semibold">
                {t('ui.parent.addGoal')}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setLimitOpen(true)}
              className={`${actionCardClass} ${
                demo.cardLimit !== null ? 'border-primary/40 bg-primary/5 ring-1 ring-primary/20' : ''
              }`}
            >
              <span className="text-lg" aria-hidden="true">
                ⏱
              </span>
              <div className="mt-2 min-w-0">
                <span className="line-clamp-2 font-heading text-sm font-semibold">
                  {t('ui.parent.limit')}
                </span>
                <span
                  className={`mt-0.5 block line-clamp-2 text-xs font-medium ${
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
          </div>
        </section>

        <section>
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
            <div className="rounded-card border border-border bg-surface p-5">
              <p className="text-sm text-text-muted">{t('ui.parent.childTasksEmpty')}</p>
            </div>
          )}
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

      <LimitModal open={limitOpen} onClose={() => setLimitOpen(false)} />
      <AddTaskModal open={addTaskOpen} onClose={() => setAddTaskOpen(false)} />
      <AddGoalModal open={addGoalOpen} onClose={() => setAddGoalOpen(false)} />
      <EditTaskModal
        task={editingTask}
        open={editingTask !== null}
        onClose={() => setEditingTask(null)}
      />
    </>
  );
}
