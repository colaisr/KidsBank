import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ChildTabBar } from '../components/ChildTabBar';
import { isYoungChildExperience } from '../context/childExperience';
import { usePreferences } from '../context/PreferencesContext';

export function ChildShell() {
  const { cardSkin, childExperience } = usePreferences();
  const location = useLocation();
  const path = location.pathname.replace(/\/$/, '');
  const onboarding = location.pathname.startsWith('/child/onboarding');
  const hideTabBar = onboarding || isYoungChildExperience(childExperience);
  const lockYoungHomeViewport =
    (childExperience === 'youngDesigner' && path === '/child') ||
    (childExperience === 'young' && (path === '/child' || path === '/child/young/totem'));
  if (
    childExperience === 'youngDesigner' &&
    !onboarding &&
    path !== '/child' &&
    path !== '/child/profile'
  ) {
    return <Navigate to="/child" replace />;
  }

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
