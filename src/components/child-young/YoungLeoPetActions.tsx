import { useTranslation } from 'react-i18next';
import { PET_ACTION_COSTS, canAffordAction, type PetActionId } from '../../lib/pet';

type YoungLeoPetActionsProps = {
  starsBalance: number;
  taskBuff: boolean;
  onAction: (action: PetActionId) => void;
  className?: string;
};

const ACTIONS: Array<{ id: PetActionId; icon: string; labelKey: 'feed' | 'play' | 'sleep' }> = [
  { id: 'feed', icon: '🍊', labelKey: 'feed' },
  { id: 'play', icon: '▶️', labelKey: 'play' },
  { id: 'sleep', icon: '🌙', labelKey: 'sleep' },
];

export function YoungLeoPetActions({
  starsBalance,
  taskBuff,
  onAction,
  className = '',
}: YoungLeoPetActionsProps) {
  const { t } = useTranslation();

  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
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
            className="flex min-h-[4.25rem] flex-col items-center justify-center gap-0.5 rounded-2xl bg-surface-muted/80 px-1 py-2 ring-1 ring-border transition active:scale-[0.97] disabled:opacity-45"
          >
            <span className="text-xl leading-none" aria-hidden="true">{icon}</span>
            <span className="text-center text-[10px] font-semibold leading-tight text-text">
              {t(`ui.pet.${labelKey}`)}
            </span>
            <span className="text-[10px] font-bold text-accent-kids-ink">{displayCost}</span>
          </button>
        );
      })}
    </div>
  );
}
