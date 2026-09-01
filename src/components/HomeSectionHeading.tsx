import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { PresenterSheetId } from '../data/presenterSheets';
import { PresenterBadgeWithSheet } from './PresenterBadgeWithSheet';

type HomeSectionHeadingProps = {
  titleKey: string;
  to: string;
  presenterId?: PresenterSheetId;
};

export function HomeSectionHeading({ titleKey, to, presenterId }: HomeSectionHeadingProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-1.5">
        <h2 className="font-heading text-base font-semibold text-text">{t(titleKey)}</h2>
        {presenterId ? (
          <PresenterBadgeWithSheet presenterId={presenterId} variant="compact" />
        ) : null}
      </div>
      <Link to={to} className="shrink-0 text-sm font-medium text-primary">
        {t('ui.home.seeAll')}
      </Link>
    </div>
  );
}
