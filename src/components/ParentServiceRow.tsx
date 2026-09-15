import { Link } from 'react-router-dom';

type ParentServiceRowProps = {
  to: string;
  icon: string;
  title: string;
  description?: string;
  statusLabel?: string;
  showLiveDot?: boolean;
};

export function ParentServiceRow({
  to,
  icon,
  title,
  description,
  statusLabel,
  showLiveDot = false,
}: ParentServiceRowProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3.5 shadow-sm transition-[colors,box-shadow] duration-200 hover:border-primary/40 hover:shadow-md active:scale-[0.99]"
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg"
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-heading text-sm font-semibold text-text">{title}</span>
        {description ? (
          <span className="mt-0.5 block text-xs font-medium text-text-muted">{description}</span>
        ) : null}
      </span>
      <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-text-muted">
        {showLiveDot ? (
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
        ) : null}
        {statusLabel ? <span className="max-w-[8rem] truncate">{statusLabel}</span> : null}
        <span className="text-text-muted/70" aria-hidden="true">›</span>
      </span>
    </Link>
  );
}
