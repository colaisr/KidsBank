import { useTranslation } from 'react-i18next';
import { ChildPageTitle } from '../components/ChildPageTitle';

export function ChildPetPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <ChildPageTitle titleKey="ui.nav.pet" />
      <div className="px-4 py-4">
        <div className="rounded-card border border-border bg-surface p-5">
          <p className="text-sm leading-relaxed text-text-muted">{t('ui.placeholder.pet')}</p>
        </div>
      </div>
    </div>
  );
}
