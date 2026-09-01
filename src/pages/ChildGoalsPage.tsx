import { ChildPageTitle } from '../components/ChildPageTitle';
import { GoalCard } from '../components/GoalCard';
import { StarsWalletCard } from '../components/StarsWalletCard';
import { useDemoState } from '../context/DemoStateContext';

export function ChildGoalsPage() {
  const { demo } = useDemoState();

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <ChildPageTitle titleKey="ui.nav.goals" />
      <div className="space-y-4 px-4 py-4">
        <StarsWalletCard />
        <div className="space-y-3">
          {demo.goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>
    </div>
  );
}
