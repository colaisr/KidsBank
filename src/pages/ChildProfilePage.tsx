import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { DemoSettingsPanel } from '../components/DemoSettingsPanel';
import { RoleToggle } from '../components/RoleToggle';
import { demoChild } from '../data/children';
import { usePreferences } from '../context/PreferencesContext';

type ProfileLocationState = {
  from?: string;
};

export function ChildProfilePage() {
  const { t } = useTranslation();
  const location = useLocation();
  const { role } = usePreferences();
  const childName = t(`demo.${demoChild.id}.name`);
  const backTo =
    (location.state as ProfileLocationState | null)?.from ??
    (role === 'parent' ? '/parent' : '/child');

  return (
    <div className="kb-app-settings flex min-h-full flex-col bg-surface-muted">
      <header className="flex items-center justify-between gap-2 border-b border-border bg-surface px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link
            to={backTo}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-primary"
            aria-label={t('ui.app.back')}
          >
            <span aria-hidden="true">←</span>
          </Link>
          <h1 className="min-w-0 truncate font-heading text-lg font-semibold text-text">
            {t('ui.profile.settings')}
          </h1>
        </div>
        <RoleToggle compact />
      </header>
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

        <DemoSettingsPanel />
      </div>
    </div>
  );
}
