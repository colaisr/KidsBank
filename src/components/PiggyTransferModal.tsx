import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  transferCardToPiggy,
  transferPiggyToCard,
} from '../context/demoActions';
import { useDemoState } from '../context/DemoStateContext';
import { usePreferences } from '../context/PreferencesContext';
import { formatCurrency } from '../lib/format';

export type PiggyTransferMode = 'toPiggy' | 'toCard';

type PiggyTransferModalProps = {
  mode: PiggyTransferMode;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onInsufficient: () => void;
};

const PRESETS = [500, 1000, 2000];

export function PiggyTransferModal({
  mode,
  open,
  onClose,
  onSuccess,
  onInsufficient,
}: PiggyTransferModalProps) {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo, setDemo } = useDemoState();
  const [amount, setAmount] = useState(PRESETS[0]);

  if (!open) {
    return null;
  }

  const sourceBalance = mode === 'toPiggy' ? demo.card.balance : demo.piggy.balance;
  const sourceLabel =
    mode === 'toPiggy'
      ? t('ui.piggy.sourceCard', {
          amount: formatCurrency(demo.card.balance, locale, 'AMD', 2),
        })
      : t('ui.piggy.sourcePiggy', {
          amount: formatCurrency(demo.piggy.balance, locale),
        });
  const title =
    mode === 'toPiggy' ? t('ui.piggy.depositFromCard') : t('ui.piggy.withdrawToCard');
  const insufficient = amount > sourceBalance;

  function handleTransfer() {
    if (insufficient) {
      onInsufficient();
      return;
    }

    setDemo((s) =>
      mode === 'toPiggy' ? transferCardToPiggy(s, amount) : transferPiggyToCard(s, amount),
    );
    onClose();
    onSuccess();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-card border border-border bg-surface p-5 shadow-xl">
        <h2 className="font-heading text-lg font-semibold text-text">{title}</h2>
        <p className="mt-1 text-sm text-text-muted">{sourceLabel}</p>

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
            disabled={insufficient}
            className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {t('ui.transfer.send')}
          </button>
        </div>
      </div>
    </div>
  );
}
