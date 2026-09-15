import { useTranslation } from 'react-i18next';

type YoungLeoPetNeedBarsProps = {
  fullness: number;
  joy: number;
  className?: string;
};

const NEEDS = [
  { key: 'fullness' as const, barClass: 'bg-primary' },
  { key: 'joy' as const, barClass: 'bg-orange-400' },
];

export function YoungLeoPetNeedBars({ fullness, joy, className = '' }: YoungLeoPetNeedBarsProps) {
  const { t } = useTranslation();
  const values = { fullness, joy };

  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      {NEEDS.map(({ key, barClass }) => {
        const value = values[key];
        return (
          <div
            key={key}
            className="rounded-2xl bg-surface-muted/80 px-2.5 py-2 ring-1 ring-border"
          >
            <div className="mb-1 flex items-center justify-between gap-1 text-[10px]">
              <span className="font-semibold text-text">{t(`ui.pet.${key}`)}</span>
              <span className="font-medium text-text-muted">{value}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-surface">
              <div className={`h-full rounded-full ${barClass}`} style={{ width: `${value}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
