import { useTranslation } from 'react-i18next';
import { ChildPageTitle } from '../../components/ChildPageTitle';
import { YoungLionTotem } from '../../components/child-young/YoungLionTotem';

export function YoungTotemPlaceholderPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <ChildPageTitle
        titleKey="ui.childYoung.totem.title"
        backTo="/child"
        showSettingsLink={false}
      />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 pb-12 text-center">
        <YoungLionTotem className="h-28 w-28" />
        <p className="max-w-xs text-sm text-text-muted">{t('ui.childYoung.totem.placeholder')}</p>
      </div>
    </div>
  );
}
