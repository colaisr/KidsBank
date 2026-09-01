import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type TransferTarget,
  transferParentToChild,
} from '../context/demoActions';
import { useDemoState } from '../context/DemoStateContext';
import { usePreferences } from '../context/PreferencesContext';
import { formatCurrency } from '../lib/format';

type TransferModalProps = {
  open: boolean;
  onClose: () => void;
};

const PRESETS = [500, 1000, 2000];

export function TransferModal({ open, onClose }: TransferModalProps) {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo, setDemo } = useDemoState();
  const [target, setTarget] = useState<TransferTarget>('card');
  const [amount, setAmount] = useState(PRESETS[1]);

  if (!open) {
    return null;
  }

  function handleTransfer() {
    setDemo((s) => transferParentToChild(s, amount, target));
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-card border border-border bg-surface p-5 shadow-xl">
        <h2 className="font-heading text-lg font-semibold text-text">{t('ui.transfer.title')}</h2>
        <p className="mt-1 text-sm text-text-muted">
          {t('ui.transfer.wallet', {
            amount: formatCurrency(demo.parentWallet, locale),
          })}
        </p>

        <div className="mt-4 flex gap-2">
          {(['card', 'piggy'] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTarget(id)}
              className={`flex-1 rounded-full px-3 py-2 text-sm font-medium ${
                target === id ? 'bg-primary text-white' : 'bg-surface-muted text-text'
              }`}
            >
              {t(`ui.transfer.target.${id}`)}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmount(preset)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                amount === preset ? 'bg-primary text-white' : 'bg-surface-muted text-text'
              }`}
            >
              {formatCurrency(preset, locale)}
            </button>
          ))}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-text"
          >
            {t('ui.transfer.cancel')}
          </button>
          <button
            type="button"
            onClick={handleTransfer}
            disabled={amount > demo.parentWallet}
            className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {t('ui.transfer.send')}
          </button>
        </div>
      </div>
    </div>
  );
}
