import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { demoChild } from '../data/children';

export function ChildProfileCard() {
  const { t } = useTranslation();
  const location = useLocation();
  const childName = t(`demo.${demoChild.id}.name`);

  return (
    <Link
      to="/child/profile"
      state={{ from: location.pathname }}
      className="flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3 shadow-sm transition-colors duration-200 hover:border-primary/30"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-lg font-semibold text-white">
        {demoChild.avatarLetter}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-heading text-base font-semibold text-text">{childName}</p>
        <p className="text-sm text-text-muted">{t('ui.profile.settings')}</p>
      </div>
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white"
        aria-hidden="true"
      >
        ›
      </span>
    </Link>
  );
}
