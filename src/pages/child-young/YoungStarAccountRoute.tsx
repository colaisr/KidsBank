import { Navigate } from 'react-router-dom';
import { usePreferences } from '../../context/PreferencesContext';
import { YoungChildStarAccountPage } from './YoungChildStarAccountPage';

export function YoungStarAccountRoute() {
  const { childExperience } = usePreferences();

  if (childExperience !== 'young') {
    return <Navigate to="/child/goals" replace />;
  }

  return <YoungChildStarAccountPage />;
}
