import type { CSSProperties } from 'react';

const BURST_PARTICLES = [
  { tx: '0px', ty: '-34px', size: 'text-lg', delay: '0ms' },
  { tx: '24px', ty: '-22px', size: 'text-sm', delay: '40ms' },
  { tx: '-24px', ty: '-22px', size: 'text-sm', delay: '60ms' },
  { tx: '30px', ty: '4px', size: 'text-xs', delay: '20ms' },
  { tx: '-30px', ty: '4px', size: 'text-xs', delay: '50ms' },
  { tx: '14px', ty: '-32px', size: 'text-base', delay: '30ms' },
  { tx: '-14px', ty: '-30px', size: 'text-base', delay: '70ms' },
  { tx: '0px', ty: '-42px', size: 'text-xl', delay: '10ms' },
] as const;

type TaskCompleteBurstProps = {
  active: boolean;
};

export function TaskCompleteBurst({ active }: TaskCompleteBurstProps) {
  if (!active) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute -right-1 top-0 h-12 w-12"
      aria-hidden="true"
    >
      {BURST_PARTICLES.map((particle, index) => (
        <span
          key={index}
          className={`task-burst-star absolute left-1/2 top-1/2 ${particle.size} text-accent-kids`}
          style={
            {
              '--tx': particle.tx,
              '--ty': particle.ty,
              animationDelay: particle.delay,
            } as CSSProperties
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}
