import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ChildPageTitle } from '../components/ChildPageTitle';
import { DemoSettingsPanel } from '../components/DemoSettingsPanel';
import { RoleToggle } from '../components/RoleToggle';
import { demoChild } from '../data/children';

type ProfileLocationState = {
  from?: string;
};

export function ChildProfilePage() {
  const { t } = useTranslation();
  const location = useLocation();
  const childName = t(`demo.${demoChild.id}.name`);
  const backTo = (location.state as ProfileLocationState | null)?.from ?? '/child';

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <ChildPageTitle titleKey="ui.profile.settings" showSettingsLink={false} backTo={backTo} />
      <div className="space-y-4 px-4 py-4">
        <Link
          to="/child/onboarding/role"
          className="flex items-center gap-4 rounded-card border border-border bg-surface p-4 transition-colors hover:border-primary/30"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
            {demoChild.avatarLetter}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-heading text-lg font-semibold text-text">{childName}</p>
            <p className="text-sm text-text-muted">{t('ui.profile.subtitle')}</p>
          </div>
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white"
            aria-hidden="true"
          >
            ›
          </span>
        </Link>

        <section className="rounded-card border border-border bg-surface p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
            {t('ui.profile.role')}
          </p>
          <RoleToggle />
        </section>

        <DemoSettingsPanel />
      </div>
    </div>
  );
}
