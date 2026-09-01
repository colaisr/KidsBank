import { useState } from 'react';
import type { PresenterSheetId } from '../data/presenterSheets';
import { PresenterInfoBadge } from './PresenterInfoBadge';
import { PresenterValueSheet } from './PresenterValueSheet';

type PresenterBadgeWithSheetProps = {
  presenterId: PresenterSheetId;
  variant?: 'default' | 'onGradient' | 'compact';
};

export function PresenterBadgeWithSheet({
  presenterId,
  variant = 'default',
}: PresenterBadgeWithSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PresenterInfoBadge variant={variant} onClick={() => setOpen(true)} />
      <PresenterValueSheet
        presenterId={presenterId}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
