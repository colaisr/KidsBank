import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { transferChildToRecipient } from '../../context/demoActions';
import { useDemoState } from '../../context/DemoStateContext';
import { usePreferences } from '../../context/PreferencesContext';
import type { DemoTransferRecipient } from '../../data/demoBaseline';
import {
  DEFAULT_YOUNG_TRANSFER_AMOUNT,
  YOUNG_TRANSFER_AMOUNTS,
  type YoungTransferAmount,
} from '../../data/youngTransfer';
import { formatCurrency, formatNumber } from '../../lib/format';
import {
  TRANSFER_AVATAR_RING_CLASS,
  TRANSFER_AVATAR_TONE_CLASS,
  enabledTransferRecipients,
  transferRecipientAmountForName,
  transferRecipientDativeName,
  transferRecipientDisplayName,
} from '../../lib/transferRecipients';

type TransferError = 'limit' | 'insufficient' | 'recipientLimit' | null;

export function YoungChildTransferPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { locale } = usePreferences();
  const { demo, setDemo } = useDemoState();

  const recipients = useMemo(
    () => enabledTransferRecipients(demo.transferRecipients),
    [demo.transferRecipients],
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [amount, setAmount] = useState<YoungTransferAmount>(DEFAULT_YOUNG_TRANSFER_AMOUNT);
  const [error, setError] = useState<TransferError>(null);

  useEffect(() => {
    if (recipients.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !recipients.some((r) => r.id === selectedId)) {
      setSelectedId(recipients[0].id);
    }
  }, [recipients, selectedId]);

  const selected = recipients.find((r) => r.id === selectedId) ?? null;

  function handleTransfer() {
    if (!selected) {
      return;
    }
    setError(null);
    const result = transferChildToRecipient(demo, selected.id, amount);
    if (result === 'limit') {
      setError('limit');
      return;
    }
    if (result === 'insufficient') {
      setError('insufficient');
      return;
    }
    if (result === 'recipientLimit') {
      setError('recipientLimit');
      return;
    }
    if (result === 'disabled') {
      return;
    }
    setDemo(result);
    navigate('/child');
  }

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <header className="border-b border-border bg-surface px-4 pb-4 pt-3">
        <div className="flex items-center gap-3">
          <Link
            to="/child"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-primary"
            aria-label={t('ui.app.back')}
          >
            <span aria-hidden="true">←</span>
          </Link>
          <h1 className="min-w-0 flex-1 text-center font-heading text-lg font-semibold text-text pr-9">
            {t('ui.childYoung.transfer.title')}
          </h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col px-4 py-5">
        <p className="text-center text-sm font-medium text-text">
          {t('ui.childYoung.transfer.recipientPrompt')}
        </p>

        {recipients.length === 0 ? (
          <p className="mt-6 text-center text-sm text-text-muted">
            {t('ui.childYoung.transfer.emptyRecipients')}
          </p>
        ) : (
          <div className="mt-5 flex justify-center gap-4">
            {recipients.map((recipient) => (
              <RecipientAvatar
                key={recipient.id}
                recipient={recipient}
                selected={recipient.id === selectedId}
                onSelect={() => {
                  setSelectedId(recipient.id);
                  setError(null);
                }}
                label={transferRecipientDisplayName(recipient, t)}
              />
            ))}
          </div>
        )}

        <p className="mt-4 text-center text-xs text-text-muted">
          {t('ui.childYoung.transfer.parentsNote')}
        </p>

        {selected ? (
          <>
            <p className="mt-10 text-center text-sm text-text-muted">
              {t('ui.childYoung.transfer.amountFor', {
                name: transferRecipientAmountForName(selected, t),
              })}
            </p>
            <p className="mt-2 text-center font-heading text-4xl font-bold tracking-tight text-text">
              {formatNumber(amount, locale)}
              <span className="ml-1 text-3xl font-semibold text-primary">֏</span>
            </p>

            <div className="mt-6 flex justify-center gap-2">
              {YOUNG_TRANSFER_AMOUNTS.map((preset) => {
                const isSelected = amount === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAmount(preset);
                      setError(null);
                    }}
                    className={`min-w-[5.5rem] rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                      isSelected
                        ? 'border-primary/30 bg-primary/15 text-primary'
                        : 'border-border bg-surface text-text hover:border-primary/20'
                    }`}
                  >
                    {formatCurrency(preset, locale)}
                  </button>
                );
              })}
            </div>
          </>
        ) : null}

        <div className="mt-auto space-y-3 pt-10">
          {error ? (
            <p className="text-center text-sm font-medium text-red-600" role="alert">
              {t(`ui.childYoung.transfer.errors.${error}`)}
            </p>
          ) : null}
          <button
            type="button"
            onClick={handleTransfer}
            disabled={!selected}
            className="w-full rounded-full bg-primary py-3.5 font-heading text-base font-semibold text-white shadow-md transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {selected
              ? t('ui.childYoung.transfer.cta', {
                  name: transferRecipientDativeName(selected, t),
                })
              : t('ui.childYoung.transfer.ctaDisabled')}
          </button>
        </div>
      </div>
    </div>
  );
}

function RecipientAvatar({
  recipient,
  selected,
  onSelect,
  label,
}: {
  recipient: DemoTransferRecipient;
  selected: boolean;
  onSelect: () => void;
  label: string;
}) {
  const ring = TRANSFER_AVATAR_RING_CLASS[recipient.avatarTone];
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex flex-col items-center gap-2 text-center"
      aria-pressed={selected}
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-full font-heading text-lg font-semibold ring-2 ring-offset-2 ring-offset-surface-muted transition-shadow ${TRANSFER_AVATAR_TONE_CLASS[recipient.avatarTone]} ${
          selected ? `${ring} shadow-md` : 'ring-transparent'
        }`}
      >
        {recipient.initial}
      </span>
      <span className="max-w-[4.5rem] text-[11px] font-medium leading-tight text-text">
        {label}
      </span>
    </button>
  );
}
