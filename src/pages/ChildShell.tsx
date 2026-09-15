import { Outlet, useLocation } from 'react-router-dom';
import { ChildTabBar } from '../components/ChildTabBar';
import { usePreferences } from '../context/PreferencesContext';

export function ChildShell() {
  const { cardSkin, childExperience } = usePreferences();
  const location = useLocation();
  const hideTabBar =
    location.pathname.startsWith('/child/onboarding') || childExperience === 'young';
  const lockYoungHomeViewport =
    childExperience === 'young' && location.pathname.replace(/\/$/, '') === '/child';

  return (
    <div className="kb-child-shell flex min-h-0 flex-1 flex-col bg-surface-muted" data-card-skin={cardSkin}>
      <div
        className={
          lockYoungHomeViewport
            ? 'flex min-h-0 flex-1 flex-col overflow-hidden'
            : 'min-h-0 flex-1 overflow-y-auto'
        }
      >
        <Outlet />
      </div>
      {hideTabBar ? null : <ChildTabBar />}
    </div>
  );
}
