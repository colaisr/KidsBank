import { Navigate, Route, Routes } from 'react-router-dom';
import { PhoneFrame } from './components/PhoneFrame';
import { PreferencesProvider } from './context/PreferencesContext';
import { readInitialPreferences } from './context/preferences';
import { AppearancePage } from './pages/AppearancePage';
import { ChildShell } from './pages/ChildShell';
import { ParentShell } from './pages/ParentShell';

function RoleRedirect() {
  const { role } = readInitialPreferences();
  return <Navigate to={role === 'parent' ? '/parent' : '/child'} replace />;
}

export default function App() {
  return (
    <PreferencesProvider>
      <PhoneFrame>
        <Routes>
          <Route path="/" element={<RoleRedirect />} />
          <Route path="/child" element={<ChildShell />} />
          <Route path="/parent" element={<ParentShell />} />
          <Route path="/appearance" element={<AppearancePage />} />
          <Route path="*" element={<RoleRedirect />} />
        </Routes>
      </PhoneFrame>
    </PreferencesProvider>
  );
}
