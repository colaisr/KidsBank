import { useTranslation } from 'react-i18next';
import { AppearanceButton } from '../components/AppearanceButton';
import { RoleToggle } from '../components/RoleToggle';
import type { PresenterSheetId } from '../data/presenterSheets';
import { PresenterBadgeWithSheet } from '../components/PresenterBadgeWithSheet';

type AppHeaderProps = {
  titleKey: string;
  showRoleToggle?: boolean;
  presenterId?: PresenterSheetId;
  /** Tighter bar for parent home dashboard fit */
  compact?: boolean;
};

export function AppHeader({
  titleKey,
  showRoleToggle = true,
  presenterId,
  compact = false,
}: AppHeaderProps) {
  const { t } = useTranslation();

  return (
    <header
      className={`flex items-center justify-between gap-2 border-b border-border px-4 ${
        compact ? 'py-2' : 'py-3'
      }`}
    >
      <h1
        className={`min-w-0 truncate font-heading font-semibold text-text ${
          compact ? 'text-base' : 'text-lg'
        }`}
      >
        {t(titleKey)}
      </h1>
      <div className="flex shrink-0 items-center gap-0.5">
        {presenterId ? <PresenterBadgeWithSheet presenterId={presenterId} /> : null}
        {showRoleToggle ? <RoleToggle /> : null}
        <AppearanceButton />
      </div>
    </header>
  );
}
