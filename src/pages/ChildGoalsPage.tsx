import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePreferences } from '../context/PreferencesContext';
import { ChildGoalsHeader } from '../components/ChildGoalsHeader';
import { GoalActionSheet } from '../components/GoalActionSheet';
import { GoalCatalogCard } from '../components/GoalCatalogCard';
import { selectGoal } from '../context/demoActions';
import { useDemoState } from '../context/DemoStateContext';
import type { DemoGoalState } from '../data/demoBaseline';
import { GOAL_CATALOG } from '../data/goalCatalog';
import { getSelectedGoals, getVitrineGoals } from '../lib/goals';

function sortGoalsByCatalogOrder(goals: DemoGoalState[]): DemoGoalState[] {
  const order = GOAL_CATALOG.map((entry) => entry.templateId);
  return [...goals].sort((a, b) => {
    const ai = order.indexOf(a.templateId);
    const bi = order.indexOf(b.templateId);
    const aRank = ai === -1 ? order.length : ai;
    const bRank = bi === -1 ? order.length : bi;
    return aRank - bRank;
  });
}

export function ChildGoalsPage() {
  const { t } = useTranslation();
  const { childExperience } = usePreferences();
  const { demo, setDemo } = useDemoState();
  const [selectedGoal, setSelectedGoal] = useState<DemoGoalState | null>(null);

  const myGoals = useMemo(
    () => sortGoalsByCatalogOrder(getSelectedGoals(demo.goals)),
    [demo.goals],
  );
  const vitrineGoals = useMemo(
    () => sortGoalsByCatalogOrder(getVitrineGoals(demo.goals)),
    [demo.goals],
  );

  if (childExperience === 'young') {
    return <Navigate to="/child/young/stars" replace />;
  }

  function handleSelect(goalId: string) {
    setDemo((state) => selectGoal(state, goalId));
  }

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <ChildGoalsHeader />

      <div className="space-y-6 px-4 py-4">
        <section>
          <h2 className="mb-3 font-heading text-base font-semibold text-text">
            {t('ui.goals.selectedSection')}
          </h2>
          {myGoals.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {myGoals.map((goal) => (
                <GoalCatalogCard
                  key={goal.id}
                  variant="active"
                  goal={goal}
                  onOpen={() => setSelectedGoal(goal)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted">{t('ui.goals.selectedEmpty')}</p>
          )}
        </section>

        {vitrineGoals.length > 0 ? (
          <section>
            <h2 className="mb-3 font-heading text-base font-semibold text-text">
              {t('ui.goals.vitrineSection')}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {vitrineGoals.map((goal) => (
                <GoalCatalogCard
                  key={goal.id}
                  variant="vitrine"
                  goal={goal}
                  onSelect={() => handleSelect(goal.id)}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <GoalActionSheet goal={selectedGoal} onClose={() => setSelectedGoal(null)} />
    </div>
  );
}
