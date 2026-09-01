import { useTranslation } from 'react-i18next';

type PresenterInfoBadgeProps = {
  onClick: () => void;
};

export function PresenterInfoBadge({ onClick }: PresenterInfoBadgeProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs text-text-muted/50 transition hover:bg-surface-muted hover:text-text-muted"
      aria-label={t('ui.pet.presenter.open')}
    >
      i
    </button>
  );
}
