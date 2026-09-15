import { Navigate } from 'react-router-dom';
import { usePreferences } from '../../context/PreferencesContext';
import { YoungChildPhoneTopUpPage } from './YoungChildPhoneTopUpPage';

export function YoungPhoneTopUpRoute() {
  const { childExperience } = usePreferences();

  if (childExperience !== 'young') {
    return <Navigate to="/child" replace />;
  }

  return <YoungChildPhoneTopUpPage />;
}
