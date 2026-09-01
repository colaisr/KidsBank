import { useTranslation } from 'react-i18next';
import type { TaskStats } from '../data/demoBaseline';
import { formatNumber } from '../lib/format';
import { usePreferences } from '../context/PreferencesContext';

type TaskStatsCardsProps = {
  stats: TaskStats;
};

export function TaskStatsCards({ stats }: TaskStatsCardsProps) {
  const { t } = useTranslation();
  const { locale } = usePreferences();

  return (
    <div className="grid grid-cols-2 gap-3">
      <article className="rounded-card bg-gradient-to-br from-accent-kids/90 to-orange-400 p-4 text-white shadow-md">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-heading text-3xl font-bold leading-none">
              {formatNumber(stats.starsEarned, locale)}
            </p>
            <p className="mt-1 text-sm font-medium text-white/90">{t('ui.tasks.statsEarned')}</p>
          </div>
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg"
            aria-hidden="true"
          >
            ★
          </span>
        </div>
      </article>

      <article className="rounded-card bg-gradient-to-br from-emerald-500 to-green-600 p-4 text-white shadow-md">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-heading text-3xl font-bold leading-none">
              {formatNumber(stats.tasksCompleted, locale)}
            </p>
            <p className="mt-1 text-sm font-medium text-white/90">{t('ui.tasks.statsCompleted')}</p>
          </div>
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg"
            aria-hidden="true"
          >
            ✓
          </span>
        </div>
      </article>
    </div>
  );
}
