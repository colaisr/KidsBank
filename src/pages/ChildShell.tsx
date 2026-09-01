import { Outlet } from 'react-router-dom';
import { ChildTabBar } from '../components/ChildTabBar';

export function ChildShell() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface-muted">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <ChildTabBar />
    </div>
  );
}
