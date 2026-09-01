import { useTranslation } from 'react-i18next';
import { AppearanceButton } from '../components/AppearanceButton';
import { RoleToggle } from '../components/RoleToggle';

type AppHeaderProps = {
  titleKey: string;
  showRoleToggle?: boolean;
};

export function AppHeader({ titleKey, showRoleToggle = true }: AppHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
      <h1 className="min-w-0 truncate font-heading text-lg font-semibold text-text">{t(titleKey)}</h1>
      <div className="flex shrink-0 items-center gap-2">
        {showRoleToggle ? <RoleToggle /> : null}
        <AppearanceButton />
      </div>
    </header>
  );
}
