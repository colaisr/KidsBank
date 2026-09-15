import { Link } from 'react-router-dom';

type ParentServiceRowProps = {
  to: string;
  icon: string;
  title: string;
  statusLabel: string;
  showLiveDot?: boolean;
};

export function ParentServiceRow({
  to,
  icon,
  title,
  statusLabel,
  showLiveDot = false,
}: ParentServiceRowProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3.5 transition-colors hover:border-primary/40"
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg"
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1 font-heading text-sm font-semibold text-text">{title}</span>
      <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-text-muted">
        {showLiveDot ? (
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
        ) : null}
        <span className="max-w-[8rem] truncate">{statusLabel}</span>
        <span className="text-text-muted/70" aria-hidden="true">›</span>
      </span>
    </Link>
  );
}
