import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type YoungLeoPetNeedMetersProps = {
  fullness: number;
  joy: number;
  children: ReactNode;
  className?: string;
};

const RING_R = 20;
const RING_C = 2 * Math.PI * RING_R;

function NeedRing({
  value,
  label,
  fillClass,
  trackClass,
  icon,
}: {
  value: number;
  label: string;
  fillClass: string;
  trackClass: string;
  icon: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const offset = RING_C * (1 - clamped / 100);

  return (
    <div className="flex w-[3.25rem] shrink-0 flex-col items-center gap-0.5 pb-1">
      <span className="text-sm leading-none" aria-hidden="true">{icon}</span>
      <div className="relative">
        <svg width="48" height="48" viewBox="0 0 48 48" className="block" aria-hidden="true">
          <circle cx="24" cy="24" r={RING_R} fill="none" className={trackClass} strokeWidth="4.5" />
          <circle
            cx="24"
            cy="24"
            r={RING_R}
            fill="none"
            className={fillClass}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray={RING_C}
            strokeDashoffset={offset}
            transform="rotate(-90 24 24)"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-text">
          {clamped}
        </span>
      </div>
      <span className="max-w-[3.25rem] text-center text-[8px] font-semibold leading-tight text-text-muted">
        {label}
      </span>
    </div>
  );
}

/** Fullness left, joy right — Leo in the middle. */
export function YoungLeoPetFlankMeters({
  fullness,
  joy,
  children,
  className = '',
}: YoungLeoPetNeedMetersProps) {
  const { t } = useTranslation();

  return (
    <div className={`flex items-end justify-center gap-0.5 ${className}`}>
      <NeedRing
        value={fullness}
        label={t('ui.pet.fullness')}
        icon="🍊"
        fillClass="stroke-primary"
        trackClass="stroke-primary/20"
      />
      <div className="shrink-0">{children}</div>
      <NeedRing
        value={joy}
        label={t('ui.pet.joy')}
        icon="✨"
        fillClass="stroke-orange-400"
        trackClass="stroke-orange-400/25"
      />
    </div>
  );
}
