import { ChildPageTitle } from '../components/ChildPageTitle';
import { GoalCard } from '../components/GoalCard';
import { useDemoState } from '../context/DemoStateContext';

export function ChildGoalsPage() {
  const { demo } = useDemoState();

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <ChildPageTitle titleKey="ui.nav.goals" />
      <div className="space-y-3 px-4 py-4">
        {demo.goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}
