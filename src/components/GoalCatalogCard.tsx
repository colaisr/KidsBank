import { useTranslation } from 'react-i18next';
import type { DemoGoalState } from '../data/demoBaseline';
import {
  GOAL_CARD_TONE_CLASS,
  getGoalCatalogEntry,
} from '../data/goalCatalog';
import { ACTIVITY_ICON_EMOJI } from '../data/activityIcons';
import { formatNumber } from '../lib/format';
import { getGoalTitle } from '../lib/goals';
import { usePreferences } from '../context/PreferencesContext';

type GoalCatalogCardProps =
  | {
      variant: 'active';
      goal: DemoGoalState;
      onOpen: () => void;
    }
  | {
      variant: 'vitrine';
      goal: DemoGoalState;
      onSelect: () => void;
    };

export function GoalCatalogCard(props: GoalCatalogCardProps) {
  const { t } = useTranslation();
  const { locale } = usePreferences();

  if (props.variant === 'vitrine') {
    const { goal, onSelect } = props;
    const catalogMeta = getGoalCatalogEntry(goal.templateId);
    const tone = catalogMeta?.cardTone ?? 'cyan';

    return (
      <article className="flex flex-col overflow-hidden rounded-2xl bg-surface shadow-sm">
        <div
          className={`flex items-center justify-center py-8 ${GOAL_CARD_TONE_CLASS[tone]}`}
        >
          <span className="text-4xl" aria-hidden="true">
            {ACTIVITY_ICON_EMOJI[goal.iconId]}
          </span>
        </div>
        <div className="flex flex-col gap-3 px-3 pb-3 pt-3">
          <div>
            <h3 className="font-heading text-sm font-semibold text-text">
              {getGoalTitle(goal, t)}
            </h3>
            <p className="mt-1 text-sm font-semibold text-text">
              {formatNumber(goal.targetStars, locale)} ★
            </p>
          </div>
          <button
            type="button"
            onClick={onSelect}
            className="w-full rounded-full border border-primary/30 bg-primary/10 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
          >
            {t('ui.goals.select')}
          </button>
        </div>
      </article>
    );
  }

  const { goal, onOpen } = props;
  const catalogMeta = getGoalCatalogEntry(goal.templateId);
  const tone = catalogMeta?.cardTone ?? 'cyan';
  const done = goal.currentStars >= goal.targetStars;
  const pct =
    goal.targetStars === 0
      ? 0
      : Math.min(100, Math.round((goal.currentStars / goal.targetStars) * 100));

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex flex-col overflow-hidden rounded-2xl bg-surface text-left shadow-sm transition-transform active:scale-[0.98]"
    >
      <div
        className={`flex items-center justify-center py-8 ${GOAL_CARD_TONE_CLASS[tone]}`}
      >
        <span className="text-4xl" aria-hidden="true">
          {ACTIVITY_ICON_EMOJI[goal.iconId]}
        </span>
      </div>
      <div className="flex flex-col gap-2 px-3 pb-3 pt-3">
        <div>
          <h3 className="font-heading text-sm font-semibold text-text">
            {getGoalTitle(goal, t)}
          </h3>
          <p className="mt-1 text-sm font-semibold text-text">
            {formatNumber(goal.targetStars, locale)} ★
          </p>
        </div>
        {done ? (
          <p className="text-xs font-semibold text-primary">{t('ui.goals.done')}</p>
        ) : (
          <>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs font-semibold text-primary">{t('ui.goals.inProgress')}</p>
          </>
        )}
      </div>
    </button>
  );
}
