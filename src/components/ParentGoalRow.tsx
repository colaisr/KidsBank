import { useTranslation } from 'react-i18next';
import type { DemoGoalState } from '../data/demoBaseline';
import { usePreferences } from '../context/PreferencesContext';
import { formatCurrency, formatNumber } from '../lib/format';
import { getGoalTitle } from '../lib/goals';

type ParentGoalRowProps = {
  goal: DemoGoalState;
};

export function ParentGoalRow({ goal }: ParentGoalRowProps) {
  const { t } = useTranslation();
  const { locale } = usePreferences();

  return (
    <article className="rounded-card border border-border bg-surface p-4 shadow-sm">
      <h3 className="font-heading text-sm font-semibold text-text">{getGoalTitle(goal, t)}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-text-muted">
        {formatNumber(goal.currentStars, locale)} / {formatNumber(goal.targetStars, locale)} ★ ·{' '}
        {t('ui.parent.goalRedeemValue', {
          amount: formatCurrency(goal.amdValue, locale),
        })}
        {!goal.selected ? ` · ${t('ui.parent.goalInVitrine')}` : null}
      </p>
    </article>
  );
}
