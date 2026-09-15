import { useTranslation } from 'react-i18next';
import type { DemoTaskState } from '../data/demoBaseline';
import { usePreferences } from '../context/PreferencesContext';
import { formatNumber } from '../lib/format';
import { getTaskTitle } from '../lib/tasks';

type ParentTaskListRowProps = {
  task: DemoTaskState;
  variant: 'pending' | 'completed';
  onPress: () => void;
};

export function ParentTaskListRow({ task, variant, onPress }: ParentTaskListRowProps) {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const title = getTaskTitle(task, t);

  const iconClass =
    variant === 'completed'
      ? 'bg-emerald-500/15 text-emerald-600'
      : task.statusId === 'waitingParent'
        ? 'bg-accent-secondary/15 text-accent-secondary'
        : 'bg-accent-secondary/10 text-accent-secondary';

  const iconSymbol = variant === 'completed' ? '✓' : '⏱';

  const meta =
    variant === 'completed'
      ? t('ui.parent.tasksScreen.completedMeta', {
          stars: formatNumber(task.rewardStars, locale),
        })
      : t('ui.parent.tasksScreen.pendingMeta', {
          time: task.dueTime,
          stars: formatNumber(task.rewardStars, locale),
        });

  return (
    <button
      type="button"
      onClick={onPress}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface-muted/60"
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-card text-lg ${iconClass}`}
        aria-hidden="true"
      >
        {iconSymbol}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block font-heading text-sm font-semibold ${
            variant === 'completed' ? 'text-text-muted line-through' : 'text-text'
          }`}
        >
          {title}
        </span>
        <span className="mt-0.5 block text-xs text-text-muted">{meta}</span>
      </span>
      <span className="shrink-0 text-text-muted/70" aria-hidden="true">›</span>
    </button>
  );
}
