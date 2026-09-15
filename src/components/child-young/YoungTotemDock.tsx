import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { YoungLionTotem } from './YoungLionTotem';

export function YoungTotemDock() {
  const { t } = useTranslation();

  return (
    <div
      className="shrink-0 border-t border-border bg-surface px-4 pt-3"
      style={{
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
        borderTopLeftRadius: '1.75rem',
        borderTopRightRadius: '1.75rem',
        boxShadow: '0 -8px 24px rgba(15, 23, 42, 0.08)',
      }}
    >
      <Link
        to="/child/young/totem"
        className="mx-auto flex max-w-xs flex-col items-center gap-1 rounded-2xl py-1 transition-transform active:scale-[0.98]"
        aria-label={t('ui.childYoung.home.openTotem')}
      >
        <YoungLionTotem className="h-[5.5rem] w-[5.5rem]" />
      </Link>
    </div>
  );
}
