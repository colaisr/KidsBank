import { useTranslation } from 'react-i18next';

type PetNeedBarsProps = {
  fullness: number;
  joy: number;
  energy: number;
};

const NEEDS = [
  { key: 'fullness' as const, valueKey: 'fullness', barClass: 'bg-primary' },
  { key: 'joy' as const, valueKey: 'joy', barClass: 'bg-orange-400' },
  { key: 'energy' as const, valueKey: 'energy', barClass: 'bg-emerald-500' },
];

export function PetNeedBars({ fullness, joy, energy }: PetNeedBarsProps) {
  const { t } = useTranslation();
  const values = { fullness, joy, energy };

  return (
    <div className="space-y-3 rounded-card bg-surface p-4 shadow-sm ring-1 ring-border">
      {NEEDS.map(({ key, barClass }) => {
        const value = values[key];
        return (
          <div key={key}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-text">{t(`ui.pet.${key}`)}</span>
              <span className="text-text-muted">{value}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-surface-muted">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barClass}`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
