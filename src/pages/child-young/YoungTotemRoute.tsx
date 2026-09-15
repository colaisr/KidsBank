import { Navigate } from 'react-router-dom';
import { usePreferences } from '../../context/PreferencesContext';
import { YoungChildTotemPage } from './YoungChildTotemPage';

export function YoungTotemRoute() {
  const { childExperience } = usePreferences();

  if (childExperience !== 'young') {
    return <Navigate to="/child" replace />;
  }

  return <YoungChildTotemPage />;
}
