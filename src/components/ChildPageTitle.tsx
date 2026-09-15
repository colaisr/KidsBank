import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { PresenterSheetId } from '../data/presenterSheets';
import { HeaderPresenterActions } from './HeaderPresenterActions';

type ChildPageTitleProps = {
  titleKey: string;
  titleValues?: Record<string, string>;
  showSettingsLink?: boolean;
  backTo?: string;
  presenterId?: PresenterSheetId;
};

export function ChildPageTitle({
  titleKey,
  titleValues,
  showSettingsLink = true,
  backTo,
  presenterId,
}: ChildPageTitleProps) {
  const { t } = useTranslation();

  return (
    <header className="flex items-center gap-3 border-b border-border bg-surface px-4 py-4">
      {backTo ? (
        <Link
          to={backTo}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-primary"
          aria-label={t('ui.app.back')}
        >
          <span aria-hidden="true">←</span>
        </Link>
      ) : null}
      <h1 className="min-w-0 flex-1 font-heading text-xl font-semibold text-text">
        {t(titleKey, titleValues)}
      </h1>
      <HeaderPresenterActions
        presenterId={presenterId}
        showSettingsLink={showSettingsLink}
      />
    </header>
  );
}
