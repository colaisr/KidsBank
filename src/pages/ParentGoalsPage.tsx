import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddGoalModal } from '../components/AddGoalModal';
import { ChildPageTitle } from '../components/ChildPageTitle';
import { ParentGoalRow } from '../components/ParentGoalRow';
import { useDemoState } from '../context/DemoStateContext';
import { getActiveGoals } from '../lib/goals';

export function ParentGoalsPage() {
  const { t } = useTranslation();
  const { demo } = useDemoState();
  const [addOpen, setAddOpen] = useState(false);
  const activeGoals = getActiveGoals(demo.goals);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-surface-muted">
      <ChildPageTitle
        titleKey="ui.parent.goalsScreen.title"
        backTo="/parent"
        showSettingsLink={false}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-8">
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-heading text-sm font-semibold text-white shadow-md transition-transform active:scale-[0.99]"
          style={{ background: 'var(--kb-header-gradient)' }}
        >
          <span aria-hidden="true">+</span>
          {t('ui.parent.goalsScreen.newGoal')}
        </button>

        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {t('ui.parent.goalsScreen.sectionActive')}
          </h2>
          <div className="mt-3 space-y-2">
            {activeGoals.length > 0 ? (
              activeGoals.map((goal) => <ParentGoalRow key={goal.id} goal={goal} />)
            ) : (
              <div className="rounded-card border border-border bg-surface p-5 shadow-sm">
                <p className="text-sm text-text-muted">{t('ui.parent.childGoalsEmpty')}</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <AddGoalModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
