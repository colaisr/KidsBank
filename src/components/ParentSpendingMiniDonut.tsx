import type { ReportSlice } from '../lib/parentSpendingReport';

type ParentSpendingMiniDonutProps = {
  slices: ReportSlice[];
};

const RADIUS = 36;
const STROKE = 14;
const CENTER = 50;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ParentSpendingMiniDonut({ slices }: ParentSpendingMiniDonutProps) {
  let offset = 0;

  return (
    <div className="relative h-24 w-24 shrink-0" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="var(--kb-border)"
          strokeWidth={STROKE}
          opacity={0.25}
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
    </div>
  );
}
