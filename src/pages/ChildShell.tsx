import { Outlet } from 'react-router-dom';
import { ChildTabBar } from '../components/ChildTabBar';
import { usePreferences } from '../context/PreferencesContext';

export function ChildShell() {
  const { cardSkin } = usePreferences();

  return (
    <div className="kb-child-shell flex min-h-0 flex-1 flex-col bg-surface-muted" data-card-skin={cardSkin}>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <ChildTabBar />
    </div>
  );
}
