import { useTranslation } from 'react-i18next';
import type { DemoGoalState } from '../data/demoBaseline';
import { allocateStarsToGoal, deselectGoal, redeemGoal } from '../context/demoActions';
import { useDemoState } from '../context/DemoStateContext';
import { STAR_ALLOCATE_STEP } from '../data/starEconomy';
import { formatCurrency, formatNumber } from '../lib/format';
import { getGoalTitle } from '../lib/goals';
import { usePreferences } from '../context/PreferencesContext';

type GoalActionSheetProps = {
  goal: DemoGoalState | null;
  onClose: () => void;
};

export function GoalActionSheet({ goal, onClose }: GoalActionSheetProps) {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo, setDemo } = useDemoState();

  const liveGoal = goal ? demo.goals.find((g) => g.id === goal.id) ?? goal : null;

  if (!liveGoal) {
    return null;
  }

  const done = liveGoal.currentStars >= liveGoal.targetStars;
  const pct =
    liveGoal.targetStars === 0
      ? 0
      : Math.min(100, Math.round((liveGoal.currentStars / liveGoal.targetStars) * 100));
  const canAllocate =
    !liveGoal.redeemed &&
    !done &&
    demo.starsBalance > 0 &&
    liveGoal.currentStars < liveGoal.targetStars;
  const canRedeem = !liveGoal.redeemed && done;

  function handleAllocate() {
    if (!liveGoal) return;
    setDemo((s) => allocateStarsToGoal(s, liveGoal.id, STAR_ALLOCATE_STEP));
  }

  function handleRedeem() {
    if (!liveGoal) return;
    setDemo((s) => redeemGoal(s, liveGoal.id));
    onClose();
  }

  function handleDeselect() {
    if (!liveGoal) return;
    setDemo((s) => deselectGoal(s, liveGoal.id));
    onClose();
  }

  const canDeselect = liveGoal.selected && !liveGoal.redeemed;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-card border border-border bg-surface p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold text-text">
              {getGoalTitle(liveGoal, t)}
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {formatNumber(liveGoal.currentStars, locale)} /{' '}
              {formatNumber(liveGoal.targetStars, locale)} ★
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-text-muted"
            aria-label={t('ui.app.back')}
          >
            ×
          </button>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>

        <p className="mt-3 text-sm text-text-muted">
          {t('ui.goals.availableStars')}: {formatNumber(demo.starsBalance, locale)} ★
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {canAllocate ? (
            <button
              type="button"
              onClick={handleAllocate}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              {t('ui.goals.addStars', { count: formatNumber(STAR_ALLOCATE_STEP, locale) })}
            </button>
          ) : null}
          {canRedeem ? (
            <button
              type="button"
              onClick={handleRedeem}
              className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary"
            >
              {t('ui.goals.redeem', {
                amount: formatCurrency(liveGoal.amdValue, locale),
              })}
            </button>
          ) : null}
          {canDeselect ? (
            <button
              type="button"
              onClick={handleDeselect}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-text-muted"
            >
              {t('ui.goals.deselect')}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
