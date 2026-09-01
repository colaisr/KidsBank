import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { HeaderPresenterActions } from '../components/HeaderPresenterActions';
import { DemoSettingsPanel } from '../components/DemoSettingsPanel';
import { usePreferences } from '../context/PreferencesContext';

export function AppearancePage() {
  const { t } = useTranslation();
  const { role } = usePreferences();
  const backPath = role === 'parent' ? '/parent' : '/child';

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Link
          to={backPath}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-primary"
          aria-label={t('ui.app.back')}
        >
          <span aria-hidden="true">←</span>
        </Link>
        <h1 className="min-w-0 flex-1 font-heading text-lg font-semibold text-text">
          {t('ui.appearance.title')}
        </h1>
        <HeaderPresenterActions presenterId="appearance" showSettingsLink={false} />
      </header>

      <main className="flex flex-1 flex-col px-4 py-6">
        <DemoSettingsPanel />
      </main>
    </div>
  );
}
