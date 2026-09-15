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

  const isWaitingParent = variant === 'pending' && task.statusId === 'waitingParent';

  const iconClass =
    variant === 'completed'
      ? 'bg-emerald-500/15 text-emerald-600'
      : isWaitingParent
        ? 'bg-accent-secondary/20 text-accent-secondary ring-2 ring-accent-secondary/25'
        : 'bg-primary/10 text-primary';

  const iconSymbol = variant === 'completed' ? '✓' : isWaitingParent ? '✓' : '⏱';

  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={
        isWaitingParent
          ? t('ui.parent.tasksScreen.rowWaitingAria', { title })
          : title
      }
      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface-muted/60 ${
        isWaitingParent ? 'bg-accent-secondary/[0.06]' : ''
      }`}
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
        {variant === 'completed' ? (
          <span className="mt-0.5 block text-xs text-text-muted">
            {t('ui.parent.tasksScreen.completedMeta', {
              stars: formatNumber(task.rewardStars, locale),
            })}
          </span>
        ) : isWaitingParent ? (
          <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
            <span className="font-semibold text-accent-secondary">
              {t('ui.tasks.waitingParent')}
            </span>
            <span className="text-text-muted">
              {t('ui.parent.tasksScreen.waitingReward', {
                stars: formatNumber(task.rewardStars, locale),
              })}
            </span>
          </span>
        ) : (
          <span className="mt-0.5 block text-xs text-text-muted">
            {t('ui.parent.tasksScreen.pendingMeta', {
              time: task.dueTime,
              stars: formatNumber(task.rewardStars, locale),
            })}
          </span>
        )}
      </span>
      <span className="flex shrink-0 items-center gap-1.5">
        {isWaitingParent ? (
          <span
            className="rounded-full bg-accent-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
          >
            {t('ui.parent.tasksScreen.confirmChip')}
          </span>
        ) : null}
        <span className="text-text-muted/70" aria-hidden="true">›</span>
      </span>
    </button>
  );
}
