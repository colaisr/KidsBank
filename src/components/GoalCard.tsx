import { useTranslation } from 'react-i18next';
import type { DemoGoalState } from '../data/demoBaseline';
import { ActivityIcon } from './ActivityIcon';
import { allocateStarsToGoal, redeemGoal } from '../context/demoActions';
import { useDemoState } from '../context/DemoStateContext';
import { STAR_ALLOCATE_STEP } from '../data/starEconomy';
import { formatCurrency, formatNumber } from '../lib/format';
import { getGoalTitle } from '../lib/goals';
import { usePreferences } from '../context/PreferencesContext';

type GoalCardProps = {
  goal: DemoGoalState;
  compact?: boolean;
};

export function GoalCard({ goal, compact = false }: GoalCardProps) {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo, setDemo } = useDemoState();
  const done = goal.currentStars >= goal.targetStars;
  const pct =
    goal.targetStars === 0
      ? 0
      : Math.min(100, Math.round((goal.currentStars / goal.targetStars) * 100));
  const canAllocate =
    !goal.redeemed && !done && demo.starsBalance > 0 && goal.currentStars < goal.targetStars;
  const canRedeem = !goal.redeemed && done;

  function handleAllocate() {
    setDemo((s) => allocateStarsToGoal(s, goal.id, STAR_ALLOCATE_STEP));
  }

  function handleRedeem() {
    setDemo((s) => redeemGoal(s, goal.id));
  }

  return (
    <article
      className={`flex flex-col gap-3 rounded-card border bg-surface p-4 ${
        goal.redeemed ? 'border-primary/40 opacity-70' : done ? 'border-primary/40' : 'border-border'
      }`}
    >
      <div className="flex items-center gap-3">
        <ActivityIcon iconId={goal.iconId} size={compact ? 'sm' : 'md'} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-sm font-semibold text-text">
              {getGoalTitle(goal, t)}
            </h3>
            {goal.redeemed ? (
              <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {t('ui.goals.redeemed')}
              </span>
            ) : done && !compact ? (
              <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {t('ui.goals.done')}
              </span>
            ) : null}
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <p className="shrink-0 text-sm font-semibold text-text">
          {t('ui.goals.targetStars', { count: formatNumber(goal.targetStars, locale) })}
        </p>
      </div>

      {!compact && !goal.redeemed ? (
        <div className="flex flex-wrap items-center gap-2">
          {canAllocate ? (
            <button
              type="button"
              onClick={handleAllocate}
              className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white"
            >
              {t('ui.goals.addStars', { count: formatNumber(STAR_ALLOCATE_STEP, locale) })}
            </button>
          ) : null}
          {canRedeem ? (
            <button
              type="button"
              onClick={handleRedeem}
              className="rounded-full border border-primary px-3 py-1.5 text-xs font-semibold text-primary"
            >
              {t('ui.goals.redeem', {
                amount: formatCurrency(goal.amdValue, locale),
              })}
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
