import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChildPageTitle } from '../components/ChildPageTitle';
import { RoleToggle } from '../components/RoleToggle';
import { demoChild } from '../data/children';

export function ChildProfilePage() {
  const { t } = useTranslation();
  const childName = t(`demo.${demoChild.id}.name`);

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <ChildPageTitle titleKey="ui.profile.settings" />
      <div className="space-y-4 px-4 py-4">
        <article className="flex items-center gap-4 rounded-card border border-border bg-surface p-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
            {demoChild.avatarLetter}
          </span>
          <div className="min-w-0">
            <p className="font-heading text-lg font-semibold text-text">{childName}</p>
            <p className="text-sm text-text-muted">{t('ui.profile.subtitle')}</p>
          </div>
        </article>

        <section className="rounded-card border border-border bg-surface p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
            {t('ui.profile.role')}
          </p>
          <RoleToggle />
        </section>

        <Link
          to="/appearance"
          className="flex items-center justify-between rounded-card border border-border bg-surface px-4 py-4 transition-colors duration-200 hover:border-primary/40"
        >
          <span className="font-heading text-sm font-semibold text-text">{t('ui.profile.appearance')}</span>
          <span className="text-primary" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
