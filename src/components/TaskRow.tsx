import { useTranslation } from 'react-i18next';
import type { DemoTaskState } from '../data/demoBaseline';
import { acceptTask, completeTask } from '../context/demoActions';
import { useDemoState } from '../context/DemoStateContext';
import { formatNumber } from '../lib/format';
import { getTaskTitle } from '../lib/tasks';
import { usePreferences } from '../context/PreferencesContext';

type TaskRowProps = {
  task: DemoTaskState;
  interactive?: boolean;
};

export function TaskRow({ task, interactive = true }: TaskRowProps) {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { setDemo } = useDemoState();
  const done = task.statusId === 'done';
  const waiting = task.statusId === 'waitingParent';
  const actionable =
    interactive && (task.statusId === 'open' || task.statusId === 'inProgress');

  function handleClick() {
    if (!interactive) {
      return;
    }
    if (task.statusId === 'open') {
      setDemo((s) => acceptTask(s, task.id));
    } else if (task.statusId === 'inProgress') {
      setDemo((s) => completeTask(s, task.id));
    }
  }

  const statusLabel =
    task.statusId === 'open'
      ? t('ui.tasks.accept')
      : task.statusId === 'inProgress'
        ? t('ui.tasks.complete')
        : task.statusId === 'waitingParent'
          ? t('ui.tasks.waitingParent')
          : t('ui.tasks.done');

  return (
    <article
      className={`flex items-center gap-3 rounded-card border bg-surface px-4 py-3 ${
        done ? 'opacity-70' : 'border-border'
      }`}
    >
      <span
        className={`h-5 w-5 shrink-0 rounded-full border-2 ${
          done ? 'border-primary bg-primary' : waiting ? 'border-accent-kids bg-accent-kids/20' : 'border-border'
        }`}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <h3
          className={`font-heading text-sm font-semibold text-text ${done ? 'line-through' : ''}`}
        >
          {getTaskTitle(task, t)}
        </h3>
        {!done && (
          <p className="mt-0.5 text-xs text-text-muted">{statusLabel}</p>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="rounded-full bg-accent-kids/20 px-2.5 py-1 text-xs font-semibold text-text">
          {t('ui.tasks.rewardStars', { count: formatNumber(task.rewardStars, locale) })}
        </span>
        {actionable ? (
          <button
            type="button"
            onClick={handleClick}
            className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-white"
          >
            {task.statusId === 'open' ? t('ui.tasks.accept') : t('ui.tasks.complete')}
          </button>
        ) : null}
      </div>
    </article>
  );
}
