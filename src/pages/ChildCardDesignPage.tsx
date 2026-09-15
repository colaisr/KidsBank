import { usePreferences } from '../context/PreferencesContext';
import { YoungChildCardDesignPage } from './child-young/YoungChildCardDesignPage';
import { TeenChildCardDesignPage } from './TeenChildCardDesignPage';

export function ChildCardDesignPage() {
  const { childExperience } = usePreferences();

  if (childExperience === 'young') {
    return <YoungChildCardDesignPage />;
  }

  return <TeenChildCardDesignPage />;
}
