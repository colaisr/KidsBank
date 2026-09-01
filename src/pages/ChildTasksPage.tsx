import { ChildPageTitle } from '../components/ChildPageTitle';
import { TaskRow } from '../components/TaskRow';
import { useDemoState } from '../context/DemoStateContext';

export function ChildTasksPage() {
  const { demo } = useDemoState();

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <ChildPageTitle titleKey="ui.home.tasks" />
      <div className="space-y-2 px-4 py-4">
        {demo.tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
