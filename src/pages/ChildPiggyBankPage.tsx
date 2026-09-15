import { usePreferences } from '../context/PreferencesContext';
import { YoungChildPiggyBankPage } from './child-young/YoungChildPiggyBankPage';
import { TeenChildPiggyBankPage } from './TeenChildPiggyBankPage';

export function ChildPiggyBankPage() {
  const { childExperience } = usePreferences();

  if (childExperience === 'young') {
    return <YoungChildPiggyBankPage />;
  }

  return <TeenChildPiggyBankPage />;
}
