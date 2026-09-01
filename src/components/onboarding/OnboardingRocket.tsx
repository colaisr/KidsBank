export function OnboardingRocket() {
  return (
    <div className="relative mx-auto my-6 flex h-28 w-28 items-center justify-center" aria-hidden="true">
      <span className="absolute -left-2 top-2 text-lg text-accent-kids">✦</span>
      <span className="absolute -right-1 top-6 text-sm text-primary">✦</span>
      <span className="absolute bottom-4 left-0 text-xs text-accent-kids">✦</span>
      <svg viewBox="0 0 120 140" className="h-full w-full" fill="none">
        <path
          d="M60 8c-8 24-28 44-28 72v20l28 16 28-16v-20c0-28-20-48-28-72Z"
          fill="color-mix(in srgb, var(--kb-primary) 18%, white)"
          stroke="color-mix(in srgb, var(--kb-primary) 45%, white)"
          strokeWidth="2"
        />
        <path
          d="M32 100l28 16 28-16"
          stroke="color-mix(in srgb, var(--kb-primary) 50%, white)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="60" cy="52" r="10" fill="color-mix(in srgb, var(--kb-primary) 35%, white)" />
        <path
          d="M32 72l-12 8M92 72l12 8"
          stroke="var(--kb-accent-kids)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M48 108l-8 16M72 108l8 16"
          stroke="var(--kb-accent-kids)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
