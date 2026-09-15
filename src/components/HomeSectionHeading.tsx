import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { PresenterSheetId } from '../data/presenterSheets';
import { PresenterBadgeWithSheet } from './PresenterBadgeWithSheet';

type HomeSectionHeadingProps = {
  titleKey: string;
  to: string;
  presenterId?: PresenterSheetId;
  dense?: boolean;
};

export function HomeSectionHeading({ titleKey, to, presenterId, dense = false }: HomeSectionHeadingProps) {
  const { t } = useTranslation();

  return (
    <div className={`flex items-center justify-between gap-2 ${dense ? 'mb-1.5' : 'mb-3'}`}>
      <div className="flex min-w-0 items-center gap-1.5">
        <h2
          className={`font-heading font-semibold text-text ${dense ? 'text-sm' : 'text-base'}`}
        >
          {t(titleKey)}
        </h2>
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
