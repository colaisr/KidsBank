import { Navigate } from 'react-router-dom';
import { usePreferences } from '../../context/PreferencesContext';
import { YoungChildQrPayPage } from './YoungChildQrPayPage';

export function YoungQrPayRoute() {
  const { childExperience } = usePreferences();

  if (childExperience !== 'young') {
    return <Navigate to="/child" replace />;
  }

  return <YoungChildQrPayPage />;
}
