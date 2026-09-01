import { useTranslation } from 'react-i18next';
import { AppHeader } from '../components/AppHeader';
import { ParentHomePage } from './ParentHomePage';

export function ParentShell() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppHeader titleKey="ui.role.parentTitle" presenterId="parent-home" />
      <div
        className="px-4 pb-6 pt-8 text-white"
        style={{ background: 'var(--kb-header-gradient)' }}
      >
        <p className="font-heading text-2xl font-semibold">{t('ui.shell.parentGreeting')}</p>
        <p className="mt-1 text-sm text-white/80">{t('ui.parent.subtitle')}</p>
      </div>
      <ParentHomePage />
    </div>
  );
}
