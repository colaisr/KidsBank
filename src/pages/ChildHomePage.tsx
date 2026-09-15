import { usePreferences } from '../context/PreferencesContext';
import { YoungChildHomePage } from './child-young/YoungChildHomePage';
import { TeenChildHomePage } from './TeenChildHomePage';

export function ChildHomePage() {
  const { childExperience } = usePreferences();

  if (childExperience === 'young') {
    return <YoungChildHomePage />;
  }

  return <TeenChildHomePage />;
}
