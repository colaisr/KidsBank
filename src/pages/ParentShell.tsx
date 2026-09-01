import { useTranslation } from 'react-i18next';
import { AppHeader } from '../components/AppHeader';

export function ParentShell() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppHeader titleKey="ui.role.parentTitle" />
      <div
        className="px-4 pb-6 pt-8 text-white"
        style={{ background: 'var(--kb-header-gradient)' }}
      >
        <p className="font-heading text-2xl font-semibold">{t('ui.shell.parentGreeting')}</p>
      </div>
      <main className="flex flex-1 flex-col px-4 py-6">
        <div className="rounded-card border border-border bg-surface-muted p-5">
          <p className="text-sm leading-relaxed text-text-muted">{t('ui.shell.emptyParent')}</p>
        </div>
      </main>
    </div>
  );
}
