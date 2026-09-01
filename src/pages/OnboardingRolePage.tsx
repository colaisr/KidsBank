import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { OnboardingRocket } from '../components/onboarding/OnboardingRocket';
import { usePreferences } from '../context/PreferencesContext';

export function OnboardingRolePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { bank, setRole } = usePreferences();

  const logoPart1 = t(`ui.appearance.bank${bank === 'amio' ? 'Amio' : 'Evoca'}`);
  const logoPart2 = t(
    bank === 'amio' ? 'ui.onboarding.role.logoSuffixAmio' : 'ui.onboarding.role.logoSuffixEvoca',
  );
  const footerKey =
    bank === 'amio' ? 'ui.onboarding.role.footerAmio' : 'ui.onboarding.role.footerEvoca';
  const subtitleKey =
    bank === 'amio' ? 'ui.onboarding.role.subtitleAmio' : 'ui.onboarding.role.subtitleEvoca';

  return (
    <div className="flex min-h-full flex-col bg-surface-muted px-4 pb-6 pt-3">
      <div className="flex items-center justify-between">
        <Link
          to="/child/profile"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white"
          aria-label={t('ui.app.back')}
        >
          <span aria-hidden="true">←</span>
        </Link>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
          <span aria-hidden="true">:)</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="font-heading text-2xl font-bold tracking-tight">
          <span className="text-primary-dark">{logoPart1}</span>
          <span className="text-primary">{logoPart2}</span>
        </p>
      </div>

      <OnboardingRocket />

      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold text-primary-dark">{t('ui.onboarding.role.title')}</h1>
        <p className="mt-2 text-sm text-text-muted">{t(subtitleKey)}</p>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setRole('parent')}
          className="flex items-center gap-3 rounded-card bg-primary p-4 text-left text-white shadow-sm transition-opacity hover:opacity-95"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
            <ParentIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-heading text-lg font-bold">{t('ui.onboarding.role.parent.title')}</span>
            <span className="mt-0.5 block text-sm text-white/85">
              {t('ui.onboarding.role.parent.description')}
            </span>
          </span>
          <span className="shrink-0 text-white/80" aria-hidden="true">›</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/child/onboarding/age')}
          className="flex items-center gap-3 rounded-card bg-accent-kids p-4 text-left text-text shadow-sm transition-opacity hover:opacity-95"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/35">
            <StarIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-heading text-lg font-bold">{t('ui.onboarding.role.child.title')}</span>
            <span className="mt-0.5 block text-sm text-text/80">
              {t('ui.onboarding.role.child.description')}
            </span>
          </span>
          <span className="shrink-0 text-text/70" aria-hidden="true">›</span>
        </button>
      </div>

      <p className="mt-auto pt-8 text-center text-xs text-text-muted">{t(footerKey)}</p>
    </div>
  );
}

function ParentIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <circle cx="16" cy="9" r="2.5" />
      <path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6" />
      <path d="M14 20c0-2.2 1.8-4 4-4" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.4 7.4H18l-5.8 4.2 2.2 7L12 16.8 7 19.6l2.2-7L3 9.4h3.6L12 2z" />
    </svg>
  );
}
