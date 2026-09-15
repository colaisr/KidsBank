import { useTranslation } from 'react-i18next';

type YoungLeoPetNeedBarsProps = {
  fullness: number;
  joy: number;
};

const NEEDS = [
  { key: 'fullness' as const, barClass: 'bg-primary' },
  { key: 'joy' as const, barClass: 'bg-orange-400' },
];

export function YoungLeoPetNeedBars({ fullness, joy }: YoungLeoPetNeedBarsProps) {
  const { t } = useTranslation();
  const values = { fullness, joy };

  return (
    <div className="flex min-w-[7.5rem] flex-col gap-2.5 rounded-card bg-surface px-2.5 py-2.5 shadow-sm ring-1 ring-border">
      {NEEDS.map(({ key, barClass }) => {
        const value = values[key];
        return (
          <div key={key}>
            <div className="mb-0.5 flex items-center justify-between gap-2 text-[10px]">
              <span className="font-medium text-text">{t(`ui.pet.${key}`)}</span>
              <span className="text-text-muted">{value}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
              <div className={`h-full rounded-full ${barClass}`} style={{ width: `${value}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
