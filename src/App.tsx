import { Navigate, Route, Routes } from 'react-router-dom';
import { PhoneFrame } from './components/PhoneFrame';
import { PreferencesProvider } from './context/PreferencesContext';
import { DemoStateProvider } from './context/DemoStateContext';
import { readInitialPreferences } from './context/preferences';
import { AppearancePage } from './pages/AppearancePage';
import { ChildGoalsPage } from './pages/ChildGoalsPage';
import { ChildHomePage } from './pages/ChildHomePage';
import { ChildHubPage } from './pages/ChildHubPage';
import { ChildPetPage } from './pages/ChildPetPage';
import { ChildProfilePage } from './pages/ChildProfilePage';
import { ChildShell } from './pages/ChildShell';
import { ChildTasksPage } from './pages/ChildTasksPage';
import { ChildTransactionsPage } from './pages/ChildTransactionsPage';
import { ParentShell } from './pages/ParentShell';

function RoleRedirect() {
  const { role } = readInitialPreferences();
  return <Navigate to={role === 'parent' ? '/parent' : '/child'} replace />;
}

export default function App() {
  return (
    <PreferencesProvider>
      <DemoStateProvider>
        <PhoneFrame>
        <div className="flex min-h-0 flex-1 flex-col">
          <Routes>
            <Route path="/" element={<RoleRedirect />} />
            <Route path="/child" element={<ChildShell />}>
              <Route index element={<ChildHomePage />} />
              <Route path="tasks" element={<ChildTasksPage />} />
              <Route path="goals" element={<ChildGoalsPage />} />
              <Route path="transactions" element={<ChildTransactionsPage />} />
              <Route path="pet" element={<ChildPetPage />} />
              <Route path="hub" element={<ChildHubPage />} />
              <Route path="profile" element={<ChildProfilePage />} />
              <Route path="*" element={<Navigate to="/child" replace />} />
            </Route>
            <Route path="/parent" element={<ParentShell />} />
            <Route path="/appearance" element={<AppearancePage />} />
            <Route path="*" element={<RoleRedirect />} />
          </Routes>
        </div>
        </PhoneFrame>
      </DemoStateProvider>
    </PreferencesProvider>
  );
}
