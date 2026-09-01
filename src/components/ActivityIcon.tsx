import type { ActivityIconId } from '../data/activityIcons';
import { ACTIVITY_ICON_EMOJI } from '../data/activityIcons';

type ActivityIconProps = {
  iconId: ActivityIconId;
  size?: 'sm' | 'md';
};

export function ActivityIcon({ iconId, size = 'md' }: ActivityIconProps) {
  const box = size === 'sm' ? 'h-9 w-9 text-lg' : 'h-12 w-12 text-xl';

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-text text-white ${box}`}
      aria-hidden="true"
    >
      {ACTIVITY_ICON_EMOJI[iconId]}
    </span>
  );
}
