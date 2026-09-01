import type { PresenterSheetId } from '../data/presenterSheets';
import { DemoSettingsLink } from './DemoSettingsLink';
import { PresenterBadgeWithSheet } from './PresenterBadgeWithSheet';

type HeaderPresenterActionsProps = {
  presenterId?: PresenterSheetId;
  variant?: 'default' | 'onGradient';
  showSettingsLink?: boolean;
};

export function HeaderPresenterActions({
  presenterId,
  variant = 'default',
  showSettingsLink = true,
}: HeaderPresenterActionsProps) {
  const badgeVariant = variant === 'onGradient' ? 'onGradient' : 'default';

  return (
    <div className="flex shrink-0 items-center gap-0.5">
      {presenterId ? (
        <PresenterBadgeWithSheet presenterId={presenterId} variant={badgeVariant} />
      ) : null}
      {showSettingsLink ? <DemoSettingsLink onGradient={variant === 'onGradient'} /> : null}
    </div>
  );
}
