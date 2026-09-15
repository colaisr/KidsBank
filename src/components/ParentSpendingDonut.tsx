import type { ReportSlice } from '../lib/parentSpendingReport';

type ParentSpendingDonutProps = {
  slices: ReportSlice[];
  centerLabel: string;
  centerSubLabel: string;
};

const RADIUS = 72;
const STROKE = 22;
const CENTER = 100;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ParentSpendingDonut({
  slices,
  centerLabel,
  centerSubLabel,
}: ParentSpendingDonutProps) {
  let offset = 0;

  return (
    <div className="relative mx-auto aspect-square w-[min(100%,14rem)]">
      <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-hidden="true">
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="var(--kb-border)"
          strokeWidth={STROKE}
          opacity={0.35}
        />
        {slices.map((slice) => {
          const dash = (slice.percent / 100) * CIRCUMFERENCE;
          const circle = (
            <circle
              key={slice.id}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke={slice.color}
              strokeWidth={STROKE}
              strokeLinecap="butt"
              strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
            />
          );
          offset += dash;
          return circle;
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="font-heading text-2xl font-semibold tracking-tight text-text">
          {centerLabel}
        </p>
        <p className="mt-0.5 text-xs font-medium text-text-muted">{centerSubLabel}</p>
      </div>
    </div>
  );
}
