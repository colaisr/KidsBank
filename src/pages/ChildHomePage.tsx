import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AccountsSection } from '../components/AccountsSection';
import { ChildHomeHeader } from '../components/ChildHomeHeader';
import { ChildProfileCard } from '../components/ChildProfileCard';
import { GoalCard } from '../components/GoalCard';
import { TaskRow } from '../components/TaskRow';
import { useDemoState } from '../context/DemoStateContext';

export function ChildHomePage() {
  const { demo } = useDemoState();
  const homeTasks = demo.tasks.slice(0, 2);
  const homeGoals = demo.goals.slice(0, 1);

  return (
    <div className="bg-surface-muted">
      <ChildHomeHeader />

      <div className="space-y-5 px-4 pb-6 pt-4">
        <ChildProfileCard />
        <AccountsSection />

        <section>
          <SectionHeading titleKey="ui.home.tasks" to="/child/tasks" />
          <div className="space-y-2">
            {homeTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading titleKey="ui.home.goals" to="/child/goals" />
          <div className="space-y-3">
            {homeGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} compact />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeading({ titleKey, to }: { titleKey: string; to: string }) {
  const { t } = useTranslation();

  return (
    <div className="mb-3 flex items-baseline justify-between gap-2">
      <h2 className="font-heading text-base font-semibold text-text">{t(titleKey)}</h2>
      <Link to={to} className="shrink-0 text-sm font-medium text-primary">
        {t('ui.home.seeAll')}
      </Link>
    </div>
  );
}
