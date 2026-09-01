import { ChildPageTitle } from '../components/ChildPageTitle';
import { TaskCard } from '../components/TaskCard';
import { TaskStatsCards } from '../components/TaskStatsCards';
import { useDemoState } from '../context/DemoStateContext';
import { sortTasksForDisplay } from '../lib/tasks';

export function ChildTasksPage() {
  const { demo } = useDemoState();
  const tasks = sortTasksForDisplay(demo.tasks);

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <ChildPageTitle titleKey="ui.tasks.pageTitle" backTo="/child" presenterId="child-tasks" />
      <div className="space-y-4 px-4 py-4">
        <TaskStatsCards stats={demo.taskStats} />
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}
