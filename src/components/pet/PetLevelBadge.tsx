import { useTranslation } from 'react-i18next';
import { petLevel } from '../../lib/pet';

type PetLevelBadgeProps = {
  xp: number;
};

export function PetLevelBadge({ xp }: PetLevelBadgeProps) {
  const { t } = useTranslation();
  const level = petLevel(xp);

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 shadow-sm ring-1 ring-border">
      <span className="text-sm" aria-hidden="true">
        ★
      </span>
      <span className="text-sm font-medium text-text">
        {t('ui.pet.level', { level, name: t('demo.pet.name') })}
      </span>
    </div>
  );
}
