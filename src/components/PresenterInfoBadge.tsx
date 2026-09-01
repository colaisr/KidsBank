import { useTranslation } from 'react-i18next';

type PresenterInfoBadgeProps = {
  onClick: () => void;
  variant?: 'default' | 'onGradient' | 'compact';
};

export function PresenterInfoBadge({
  onClick,
  variant = 'default',
}: PresenterInfoBadgeProps) {
  const { t } = useTranslation();

  const sizeClass =
    variant === 'compact' ? 'h-4 w-4 text-[10px]' : 'h-5 w-5 text-xs';
  const colorClass =
    variant === 'onGradient'
      ? 'text-white/40 hover:bg-white/10 hover:text-white/70'
      : 'text-text-muted/50 hover:bg-surface-muted hover:text-text-muted';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center justify-center rounded-full font-medium transition ${sizeClass} ${colorClass}`}
      aria-label={t('ui.presenter.open')}
    >
      i
    </button>
  );
}
