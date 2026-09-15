import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { YoungLionTotem } from './YoungLionTotem';

export function YoungTotemDock() {
  const { t } = useTranslation();

  return (
    <div
      className="shrink-0 border-t border-border bg-surface px-4 pt-1.5"
      style={{
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
        borderTopLeftRadius: '1.75rem',
        borderTopRightRadius: '1.75rem',
        boxShadow: '0 -8px 24px rgba(15, 23, 42, 0.08)',
      }}
    >
      <Link
        to="/child/young/totem"
        className="mx-auto flex max-w-xs flex-col items-center rounded-2xl py-0.5 transition-transform active:scale-[0.98]"
        aria-label={t('ui.childYoung.home.openTotem')}
      >
        <YoungLionTotem className="h-[4.25rem] w-[4.25rem]" animate showGlow />
      </Link>
    </div>
  );
}
