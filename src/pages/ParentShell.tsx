import { Outlet, useLocation } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { ParentChildHeader } from '../components/ParentChildHeader';
import { ParentLocationProvider } from '../context/ParentLocationContext';
import { useDemoState } from '../context/DemoStateContext';

export function ParentShell() {
  const location = useLocation();
  const isGeolocation = location.pathname === '/parent/geolocation';
  const { demo, setDemo } = useDemoState();

  return (
    <ParentLocationProvider>
      <div className="kb-parent-shell flex min-h-0 flex-1 flex-col bg-surface-muted">
        {!isGeolocation ? (
          <>
            <AppHeader titleKey="ui.role.parentTitle" presenterId="parent-home" />
            <ParentChildHeader
              children={demo.children}
              activeChildId={demo.activeChildId}
              onSelectChild={(childId) =>
                setDemo((s) => ({ ...s, activeChildId: childId }))
              }
            />
          </>
        ) : null}
        <div
          className={`flex min-h-0 flex-1 flex-col ${isGeolocation ? 'overflow-hidden' : 'overflow-y-auto'}`}
        >
          <Outlet />
        </div>
      </div>
    </ParentLocationProvider>
  );
}
