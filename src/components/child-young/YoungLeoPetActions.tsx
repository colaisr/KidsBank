import { useTranslation } from 'react-i18next';
import { PET_ACTION_COSTS, canAffordAction, type PetActionId } from '../../lib/pet';

type YoungLeoPetActionsProps = {
  starsBalance: number;
  taskBuff: boolean;
  onAction: (action: PetActionId) => void;
};

const ACTIONS: Array<{ id: PetActionId; icon: string; labelKey: 'feed' | 'play' | 'sleep' }> = [
  { id: 'feed', icon: '🍊', labelKey: 'feed' },
  { id: 'play', icon: '▶️', labelKey: 'play' },
  { id: 'sleep', icon: '🌙', labelKey: 'sleep' },
];

export function YoungLeoPetActions({ starsBalance, taskBuff, onAction }: YoungLeoPetActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1.5">
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
            className="flex w-[4.5rem] flex-col items-center gap-0.5 rounded-card bg-surface px-1 py-2 shadow-sm ring-1 ring-border transition active:scale-[0.97] disabled:opacity-45"
          >
            <span className="text-lg" aria-hidden="true">{icon}</span>
            <span className="text-[9px] font-medium leading-tight text-text">
              {t(`ui.pet.${labelKey}`)}
            </span>
            <span className="text-[9px] font-semibold text-accent-kids-ink">{displayCost}</span>
          </button>
        );
      })}
    </div>
  );
}
