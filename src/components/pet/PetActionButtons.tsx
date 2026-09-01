import { useTranslation } from 'react-i18next';
import { PET_ACTION_COSTS, canAffordAction, type PetActionId } from '../../lib/pet';

type PetActionButtonsProps = {
  starsBalance: number;
  taskBuff: boolean;
  onAction: (action: PetActionId) => void;
};

const ACTIONS: Array<{
  id: PetActionId;
  icon: string;
  labelKey: 'feed' | 'play' | 'sleep';
}> = [
  { id: 'feed', icon: '🍊', labelKey: 'feed' },
  { id: 'play', icon: '▶️', labelKey: 'play' },
  { id: 'sleep', icon: '🌙', labelKey: 'sleep' },
];

export function PetActionButtons({ starsBalance, taskBuff, onAction }: PetActionButtonsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-3 gap-2">
      {ACTIONS.map(({ id, icon, labelKey }) => {
        const cost = PET_ACTION_COSTS[id];
        const affordable = canAffordAction(id, starsBalance, taskBuff);
        const displayCost = taskBuff ? t('ui.pet.free') : `${cost} ★`;

        return (
          <button
            key={id}
            type="button"
            disabled={!affordable}
            onClick={() => onAction(id)}
            className="flex flex-col items-center gap-1 rounded-card bg-surface px-2 py-3 shadow-sm ring-1 ring-border transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <span className="text-2xl" aria-hidden="true">
              {icon}
            </span>
            <span className="text-center text-xs font-medium text-text">{t(`ui.pet.${labelKey}`)}</span>
            <span className="text-xs font-semibold text-accent-kids">{displayCost}</span>
          </button>
        );
      })}
    </div>
  );
}
