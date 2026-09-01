import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { clearCardLimit, setCardLimit } from '../context/demoActions';
import { useDemoState } from '../context/DemoStateContext';
import { usePreferences } from '../context/PreferencesContext';
import { formatCurrency } from '../lib/format';

type LimitModalProps = {
  open: boolean;
  onClose: () => void;
};

const LIMIT_PRESETS = [500, 1000, 2000];

export function LimitModal({ open, onClose }: LimitModalProps) {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo, setDemo } = useDemoState();
  const [limit, setLimit] = useState(demo.cardLimit ?? LIMIT_PRESETS[1]);

  if (!open) {
    return null;
  }

  function handleSet() {
    setDemo((s) => setCardLimit(s, limit));
    onClose();
  }

  function handleClear() {
    setDemo((s) => clearCardLimit(s));
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-card border border-border bg-surface p-5 shadow-xl">
        <h2 className="font-heading text-lg font-semibold text-text">{t('ui.limit.title')}</h2>
        <p className="mt-1 text-sm text-text-muted">{t('ui.limit.hint')}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {LIMIT_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setLimit(preset)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                limit === preset ? 'bg-primary text-white' : 'bg-surface-muted text-text'
              }`}
            >
              {formatCurrency(preset, locale)}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleSet}
            className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white"
          >
            {t('ui.limit.set')}
          </button>
          {demo.cardLimit !== null ? (
            <button
              type="button"
              onClick={handleClear}
              className="w-full rounded-full border border-border py-2.5 text-sm font-semibold text-text"
            >
              {t('ui.limit.clear')}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-sm font-medium text-text-muted"
          >
            {t('ui.transfer.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
