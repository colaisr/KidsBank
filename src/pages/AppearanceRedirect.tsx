import { Navigate, useLocation } from 'react-router-dom';
import { usePreferences } from '../context/PreferencesContext';

/** Legacy `/appearance` → unified demo settings on child profile. */
export function AppearanceRedirect() {
  const { role } = usePreferences();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from ??
    (role === 'parent' ? '/parent' : '/child');

  return <Navigate to="/child/profile" replace state={{ from }} />;
}
