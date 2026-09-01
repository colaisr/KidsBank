import { useTranslation } from 'react-i18next';
import type { DemoTaskState } from '../data/demoBaseline';
import { formatNumber } from '../lib/format';
import { usePreferences } from '../context/PreferencesContext';

type TaskRowProps = {
  task: DemoTaskState;
};

export function TaskRow({ task }: TaskRowProps) {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const done = task.statusId === 'done';

  return (
    <article className="flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3">
      <span
        className={`h-5 w-5 shrink-0 rounded-full border-2 ${
          done ? 'border-primary bg-primary' : 'border-border'
        }`}
        aria-hidden="true"
      />
      <h3 className="min-w-0 flex-1 font-heading text-sm font-semibold text-text">
        {t(`demo.tasks.${task.id}.title`)}
      </h3>
      <span className="shrink-0 rounded-full bg-accent-kids/20 px-2.5 py-1 text-xs font-semibold text-text">
        {t('ui.tasks.rewardStars', { count: formatNumber(task.rewardStars, locale) })}
      </span>
    </article>
  );
}
