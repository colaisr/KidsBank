export function PiggyIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16 8.2c.4-.3.7-.8.7-1.4 0-.9-.8-1.6-1.7-1.6-.5 0-1 .2-1.3.6C13.2 5.3 12.6 5 12 5c-3.4 0-6.2 2.5-6.8 5.8H4.5A1.5 1.5 0 0 0 3 12.3V14a1 1 0 0 0 1 1h.6c.4 1.8 1.8 3.3 3.6 4v1.2a.8.8 0 0 0 .8.8h1.2a.8.8 0 0 0 .8-.8V19h2.2v1.2a.8.8 0 0 0 .8.8h1.2a.8.8 0 0 0 .8-.8V19c1.5-.6 2.6-1.8 3.2-3.3.8-.2 1.8-1.1 1.8-2.4 0-1-.6-1.8-1.4-2.2V11c0-1.2-.8-2.2-1.8-2.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M7 15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="18" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.2 11 15.8 7M8.2 13l7.6 4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function LinkChainIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L11 4.93"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.07 0L4.81 13.12a5 5 0 1 0 7.07 7.07L13 19.07"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
