import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DemoTaskState } from '../data/demoBaseline';
import { submitTaskForParent } from '../context/demoActions';
import { useDemoState } from '../context/DemoStateContext';
import { formatNumber } from '../lib/format';
import { getTaskTitle } from '../lib/tasks';
import { usePreferences } from '../context/PreferencesContext';
import { TaskCompleteBurst } from './TaskCompleteBurst';

type TaskCardProps = {
  task: DemoTaskState;
  interactive?: boolean;
  compact?: boolean;
};

export function TaskCard({ task, interactive = true, compact = false }: TaskCardProps) {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { setDemo } = useDemoState();
  const [celebrating, setCelebrating] = useState(false);

  const done = task.statusId === 'done';
  const waiting = task.statusId === 'waitingParent';
  const actionable =
    interactive && (task.statusId === 'open' || task.statusId === 'inProgress');

  function handleCheckboxClick() {
    if (!actionable || celebrating) {
      return;
    }

    setCelebrating(true);
    setDemo((s) => submitTaskForParent(s, task.id));
    window.setTimeout(() => setCelebrating(false), 900);
  }

  const statusLabel = done
    ? t('ui.tasks.done')
    : waiting
      ? t('ui.tasks.waitingParent')
      : t('ui.tasks.deadline', { time: task.dueTime });

  const checkboxLabel = waiting
    ? t('ui.tasks.waitingParent')
    : done
      ? t('ui.tasks.done')
      : t('ui.tasks.complete');

  return (
    <article
      className={`relative flex items-start gap-3 rounded-card border bg-surface shadow-sm transition-shadow ${
        compact ? 'p-3' : 'p-4'
      } ${done ? 'opacity-80' : celebrating ? 'border-accent-kids/40 shadow-md' : 'border-border'}`}
    >
      <div className="min-w-0 flex-1">
        <span className="inline-flex items-center gap-1 rounded-lg bg-accent-kids/20 px-2 py-0.5 text-xs font-bold text-text">
          <span aria-hidden="true">★</span>
          {formatNumber(task.rewardStars, locale)}
        </span>

        <h3
          className={`mt-2 font-heading text-sm font-semibold text-text ${
            compact ? '' : 'text-base'
          } ${done ? 'line-through' : ''}`}
        >
          {getTaskTitle(task, t)}
        </h3>

        <p
          className={`mt-1 flex items-center gap-1 text-xs font-medium ${
            done ? 'text-text-muted' : 'text-accent-kids-ink'
          }`}
        >
          <span aria-hidden="true">🕐</span>
          {statusLabel}
        </p>
      </div>

      <div className="relative shrink-0">
        <TaskCompleteBurst active={celebrating} />
        <button
          type="button"
          onClick={handleCheckboxClick}
          disabled={!actionable}
          aria-label={checkboxLabel}
          className={`mt-1 flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-colors ${
            done
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : waiting
                ? 'border-accent-kids-ink/35 bg-accent-kids/15'
                : actionable
                  ? 'border-border bg-surface hover:border-primary active:scale-95'
                  : 'border-border bg-surface-muted'
          } ${celebrating ? 'task-checkbox-pop border-accent-kids bg-accent-kids/20' : ''}`}
        >
          {done ? (
            <span className="text-lg font-bold" aria-hidden="true">
              ✓
            </span>
          ) : waiting ? (
            <span className="h-3 w-3 rounded-sm bg-accent-kids-ink/45" aria-hidden="true" />
          ) : null}
        </button>
      </div>
    </article>
  );
}
