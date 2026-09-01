import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { usePreferences } from '../context/PreferencesContext';
import type { Bank, Locale } from '../context/preferences';

const BANKS: { id: Bank; labelKey: string; swatch: string }[] = [
  { id: 'amio', labelKey: 'ui.appearance.bankAmio', swatch: '#05A9C7' },
  { id: 'evoca', labelKey: 'ui.appearance.bankEvoca', swatch: '#6400DC' },
];

const LANGUAGES: { id: Locale; labelKey: string }[] = [
  { id: 'hy', labelKey: 'ui.appearance.langHy' },
  { id: 'ru', labelKey: 'ui.appearance.langRu' },
  { id: 'en', labelKey: 'ui.appearance.langEn' },
];

export function AppearancePage() {
  const { t } = useTranslation();
  const { bank, locale, role, setBank, setLocale } = usePreferences();
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
        <h1 className="font-heading text-lg font-semibold text-text">{t('ui.appearance.title')}</h1>
      </header>

      <main className="flex flex-1 flex-col gap-8 px-4 py-6">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
            {t('ui.appearance.bankSection')}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {BANKS.map((item) => {
              const selected = bank === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBank(item.id)}
                  className={`rounded-card border p-4 text-left transition-all ${
                    selected
                      ? 'border-primary bg-primary/5 ring-2 ring-primary'
                      : 'border-border bg-surface-muted hover:border-primary/40'
                  }`}
                >
                  <span
                    className="mb-3 inline-block h-8 w-8 rounded-full"
                    style={{ backgroundColor: item.swatch }}
                    aria-hidden="true"
                  />
                  <span className="block font-heading text-base font-semibold text-text">
                    {t(item.labelKey)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
            {t('ui.appearance.languageSection')}
          </h2>
          <div className="flex flex-col gap-2">
            {LANGUAGES.map((item) => {
              const selected = locale === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLocale(item.id)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                    selected
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-surface-muted text-text hover:border-primary/40'
                  }`}
                >
                  {t(item.labelKey)}
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
