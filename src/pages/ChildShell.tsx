import { useTranslation } from 'react-i18next';
import { AppHeader } from '../components/AppHeader';
import { demoChild } from '../data/children';

export function ChildShell() {
  const { t } = useTranslation();
  const childName = t(`demo.${demoChild.id}.name`);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppHeader titleKey="ui.role.childTitle" />
      <div
        className="px-4 pb-6 pt-8 text-white"
        style={{ background: 'var(--kb-header-gradient)' }}
      >
        <p className="font-heading text-2xl font-semibold">
          {t('ui.shell.greeting', { name: childName })}
        </p>
      </div>
      <main className="flex flex-1 flex-col px-4 py-6">
        <div className="rounded-card border border-border bg-surface-muted p-5">
          <p className="text-sm leading-relaxed text-text-muted">{t('ui.shell.emptyChild')}</p>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-kids/20 text-sm font-semibold text-primary-dark">
            ★
          </span>
          <span className="text-sm font-medium text-text">{childName}</span>
        </div>
      </main>
    </div>
  );
}
