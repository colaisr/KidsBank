import { useTranslation } from 'react-i18next';
import type { DemoTaskState } from '../data/demoBaseline';
import { usePreferences } from '../context/PreferencesContext';
import { formatNumber } from '../lib/format';
import { getTaskTitle } from '../lib/tasks';

type ParentTaskRowProps = {
  task: DemoTaskState;
  onConfirm?: () => void;
  onEdit: () => void;
  onCancel: () => void;
};

export function ParentTaskRow({ task, onConfirm, onEdit, onCancel }: ParentTaskRowProps) {
  const { t } = useTranslation();
  const { locale } = usePreferences();

  const statusLabel =
    task.statusId === 'open'
      ? t('ui.tasks.accept')
      : task.statusId === 'inProgress'
        ? t('ui.tasks.complete')
        : task.statusId === 'waitingParent'
          ? t('ui.tasks.waitingParent')
          : t('ui.tasks.done');

  return (
    <article className="rounded-card border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-sm font-semibold text-text">
            {getTaskTitle(task, t)}
          </h3>
          <p className="mt-1 text-xs text-text-muted">
            {formatNumber(task.rewardStars, locale)} ★ · {t('ui.tasks.deadline', { time: task.dueTime })}
          </p>
          <p className="mt-1 text-xs font-medium text-accent-kids">{statusLabel}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {task.statusId === 'waitingParent' && onConfirm ? (
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white"
          >
            {t('ui.parent.confirmTask')}
          </button>
        ) : null}
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-text"
        >
          {t('ui.parent.editTask')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600"
        >
          {t('ui.parent.cancelTask')}
        </button>
      </div>
    </article>
  );
}
