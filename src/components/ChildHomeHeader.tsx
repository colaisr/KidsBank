import { useTranslation } from 'react-i18next';
import { HeaderPresenterActions } from './HeaderPresenterActions';

export function ChildHomeHeader() {
  const { t } = useTranslation();

  return (
    <header
      className="px-4 pb-4 pt-3 text-white"
      style={{ background: 'var(--kb-header-gradient)' }}
    >
      <div className="grid grid-cols-3 items-center gap-3">
        <div aria-hidden="true" />
        <h1 className="min-w-0 text-center font-heading text-lg font-semibold">
          {t('ui.home.title')}
        </h1>
        <div className="flex justify-end">
          <HeaderPresenterActions presenterId="child-home" variant="onGradient" />
        </div>
      </div>
    </header>
  );
}
