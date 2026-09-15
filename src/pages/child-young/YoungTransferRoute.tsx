import { Navigate } from 'react-router-dom';
import { usePreferences } from '../../context/PreferencesContext';
import { YoungChildTransferPage } from './YoungChildTransferPage';

export function YoungTransferRoute() {
  const { childExperience } = usePreferences();

  if (childExperience !== 'young') {
    return <Navigate to="/child" replace />;
  }

  return <YoungChildTransferPage />;
}
