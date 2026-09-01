import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePreferences } from '../context/PreferencesContext';
import { useDemoState } from '../context/DemoStateContext';
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

export function DemoSettingsPanel() {
  const { t } = useTranslation();
  const { bank, locale, setBank, setLocale } = usePreferences();
  const { resetDemo } = useDemoState();
  const [resetDone, setResetDone] = useState(false);

  useEffect(() => {
    if (!resetDone) {
      return;
    }
    const timer = window.setTimeout(() => setResetDone(false), 3000);
    return () => window.clearTimeout(timer);
  }, [resetDone]);

  function handleReset() {
    resetDemo();
    setResetDone(true);
  }

  return (
    <div className="flex flex-col gap-8">
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

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-muted">
          {t('ui.appearance.demoSection')}
        </h2>
        <p className="mb-3 text-sm leading-relaxed text-text-muted">{t('ui.appearance.resetHint')}</p>
        <button
          type="button"
          onClick={handleReset}
          className="w-full rounded-2xl border border-border bg-surface-muted px-4 py-3 text-left text-sm font-semibold text-text transition-colors duration-200 hover:border-primary/40"
        >
          {t('ui.appearance.resetDemo')}
        </button>
        {resetDone ? (
          <p
            role="status"
            className="mt-3 flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary"
          >
            <span aria-hidden="true">✓</span>
            {t('ui.appearance.resetDone')}
          </p>
        ) : null}
      </section>
    </div>
  );
}
