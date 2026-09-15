type YoungLionTotemProps = {
  className?: string;
};

export function YoungLionTotem({ className = 'h-20 w-20' }: YoungLionTotemProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <circle cx="60" cy="62" r="44" fill="#F4A825" />
      <circle cx="38" cy="40" r="14" fill="#F4A825" />
      <circle cx="82" cy="40" r="14" fill="#F4A825" />
      <circle cx="28" cy="58" r="12" fill="#F4A825" />
      <circle cx="92" cy="58" r="12" fill="#F4A825" />
      <circle cx="60" cy="66" r="34" fill="#FFD166" />
      <circle cx="48" cy="62" r="5" fill="#1e293b" />
      <circle cx="72" cy="62" r="5" fill="#1e293b" />
      <ellipse cx="60" cy="74" rx="10" ry="7" fill="#c2410c" />
      <path
        d="M52 78 Q60 84 68 78"
        stroke="#1e293b"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="42" cy="70" rx="6" ry="4" fill="#fb923c" opacity="0.55" />
      <ellipse cx="78" cy="70" rx="6" ry="4" fill="#fb923c" opacity="0.55" />
    </svg>
  );
}
