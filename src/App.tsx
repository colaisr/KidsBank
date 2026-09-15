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
import { ChildPiggyBankPage } from './pages/ChildPiggyBankPage';
import { ChildCardDesignPage } from './pages/ChildCardDesignPage';
import { ChildProfilePage } from './pages/ChildProfilePage';
import { ChildShell } from './pages/ChildShell';
import { OnboardingAgePage } from './pages/OnboardingAgePage';
import { OnboardingRolePage } from './pages/OnboardingRolePage';
import { YoungPhoneTopUpRoute } from './pages/child-young/YoungPhoneTopUpRoute';
import { YoungQrPayRoute } from './pages/child-young/YoungQrPayRoute';
import { YoungTotemPlaceholderPage } from './pages/child-young/YoungTotemPlaceholderPage';
import { ChildTasksPage } from './pages/ChildTasksPage';
import { ChildTransactionsPage } from './pages/ChildTransactionsPage';
import { ParentGeolocationPage } from './pages/ParentGeolocationPage';
import { ParentGoalsPage } from './pages/ParentGoalsPage';
import { ParentHomePage } from './pages/ParentHomePage';
import { ParentLimitsPage } from './pages/ParentLimitsPage';
import { ParentReportsPage } from './pages/ParentReportsPage';
import { ParentSpendingHistoryPage } from './pages/ParentSpendingHistoryPage';
import { ParentTasksPage } from './pages/ParentTasksPage';
import { ParentTransferPage } from './pages/ParentTransferPage';
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
              <Route path="piggy" element={<ChildPiggyBankPage />} />
              <Route path="card-design" element={<ChildCardDesignPage />} />
              <Route path="transactions" element={<ChildTransactionsPage />} />
              <Route path="pet" element={<ChildPetPage />} />
              <Route path="hub" element={<ChildHubPage />} />
              <Route path="profile" element={<ChildProfilePage />} />
              <Route path="onboarding/role" element={<OnboardingRolePage />} />
              <Route path="onboarding/age" element={<OnboardingAgePage />} />
              <Route path="young/totem" element={<YoungTotemPlaceholderPage />} />
              <Route path="young/phone-topup" element={<YoungPhoneTopUpRoute />} />
              <Route path="young/qr-pay" element={<YoungQrPayRoute />} />
              <Route path="*" element={<Navigate to="/child" replace />} />
            </Route>
            <Route path="/parent" element={<ParentShell />}>
              <Route index element={<ParentHomePage />} />
              <Route path="geolocation" element={<ParentGeolocationPage />} />
              <Route path="transfer" element={<ParentTransferPage />} />
              <Route path="limits" element={<ParentLimitsPage />} />
              <Route path="tasks" element={<ParentTasksPage />} />
              <Route path="reports" element={<ParentReportsPage />} />
              <Route path="spending-history" element={<ParentSpendingHistoryPage />} />
              <Route path="goals" element={<ParentGoalsPage />} />
              <Route path="*" element={<Navigate to="/parent" replace />} />
            </Route>
            <Route path="/appearance" element={<AppearancePage />} />
            <Route path="*" element={<RoleRedirect />} />
          </Routes>
        </div>
        </PhoneFrame>
      </DemoStateProvider>
    </PreferencesProvider>
  );
}
