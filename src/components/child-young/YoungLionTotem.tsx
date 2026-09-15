import { useEffect, useState } from 'react';
import './youngLionTotem.css';

type YoungLionTotemProps = {
  className?: string;
  /** Gentle idle motion (dock + totem screen). */
  animate?: boolean;
  /** Increment or change to play a short happy bounce (e.g. on tap). */
  reactToken?: number;
  showGlow?: boolean;
};

export function YoungLionTotem({
  className = 'h-20 w-20',
  animate = false,
  reactToken = 0,
  showGlow = false,
}: YoungLionTotemProps) {
  const [reacting, setReacting] = useState(false);

  useEffect(() => {
    if (!reactToken) {
      return;
    }
    setReacting(true);
    const timer = window.setTimeout(() => setReacting(false), 700);
    return () => window.clearTimeout(timer);
  }, [reactToken]);

  const motionClass = reacting
    ? 'young-lion-totem--react'
    : animate
      ? 'young-lion-totem--idle'
      : '';

  return (
    <span
      className={`young-lion-totem relative inline-flex items-center justify-center ${motionClass} ${className}`}
    >
      {showGlow ? (
        <span
          className="young-lion-totem__glow pointer-events-none absolute inset-[6%] rounded-full bg-amber-400/40 blur-md"
          aria-hidden="true"
        />
      ) : null}
      <svg
        viewBox="0 0 120 120"
        className="relative z-[1] h-full w-full"
        aria-hidden="true"
        role="img"
      >
        <g className="young-lion-totem__body">
          <g className="young-lion-totem__mane">
            <circle cx="60" cy="58" r="46" fill="#F59E0B" />
            <circle cx="34" cy="36" r="15" fill="#FBBF24" />
            <circle cx="86" cy="36" r="15" fill="#FBBF24" />
            <circle cx="22" cy="56" r="13" fill="#F59E0B" />
            <circle cx="98" cy="56" r="13" fill="#F59E0B" />
            <circle cx="30" cy="78" r="11" fill="#FBBF24" />
            <circle cx="90" cy="78" r="11" fill="#FBBF24" />
          </g>
          <ellipse cx="60" cy="98" rx="28" ry="14" fill="#FDE68A" />
          <circle cx="60" cy="64" r="36" fill="#FFEFB8" />
          <ellipse cx="38" cy="30" rx="11" ry="13" fill="#F59E0B" />
          <ellipse cx="82" cy="30" rx="11" ry="13" fill="#F59E0B" />
          <ellipse cx="38" cy="32" rx="6" ry="7" fill="#FDBA74" />
          <ellipse cx="82" cy="32" rx="6" ry="7" fill="#FDBA74" />
          <g className="young-lion-totem__eyes">
            <ellipse cx="48" cy="62" rx="11" ry="12" fill="#fff" />
            <ellipse cx="72" cy="62" rx="11" ry="12" fill="#fff" />
            <circle cx="50" cy="64" r="5.5" fill="#1e293b" />
            <circle cx="74" cy="64" r="5.5" fill="#1e293b" />
            <circle cx="52" cy="62" r="2" fill="#fff" />
            <circle cx="76" cy="62" r="2" fill="#fff" />
          </g>
          <ellipse cx="60" cy="74" rx="9" ry="7" fill="#FB923C" />
          <path
            d="M48 80 Q60 92 72 80"
            stroke="#1e293b"
            strokeWidth="2.25"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M54 80 Q60 84 66 80" fill="#fff" opacity="0.85" />
          <ellipse cx="40" cy="72" rx="7" ry="5" fill="#FDA4AF" opacity="0.55" />
          <ellipse cx="80" cy="72" rx="7" ry="5" fill="#FDA4AF" opacity="0.55" />
          <ellipse cx="44" cy="100" rx="10" ry="8" fill="#FFEFB8" />
          <ellipse cx="76" cy="100" rx="10" ry="8" fill="#FFEFB8" />
        </g>
      </svg>
    </span>
  );
}
