import { AccountsSection } from '../components/AccountsSection';
import { ChildHomeHeader } from '../components/ChildHomeHeader';
import { ChildProfileCard } from '../components/ChildProfileCard';
import { GoalCard } from '../components/GoalCard';
import { HomeSectionHeading } from '../components/HomeSectionHeading';
import { TaskCard } from '../components/TaskCard';
import { useDemoState } from '../context/DemoStateContext';
import { getActiveGoals } from '../lib/goals';
import { getActiveTasks } from '../lib/tasks';

export function ChildHomePage() {
  const { demo } = useDemoState();
  const homeTasks = getActiveTasks(demo.tasks).slice(0, 2);
  const homeGoals = getActiveGoals(demo.goals).slice(0, 1);

  return (
    <div className="bg-surface-muted">
      <ChildHomeHeader />

      <div className="space-y-5 px-4 pb-6 pt-4">
        <ChildProfileCard />
        <AccountsSection />

        <section>
          <HomeSectionHeading
            titleKey="ui.home.tasks"
            to="/child/tasks"
            presenterId="child-tasks"
          />
          <div className="space-y-2">
            {homeTasks.map((task) => (
              <TaskCard key={task.id} task={task} compact />
            ))}
          </div>
        </section>

        <section>
          <HomeSectionHeading
            titleKey="ui.home.goals"
            to="/child/goals"
            presenterId="child-goals"
          />
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
