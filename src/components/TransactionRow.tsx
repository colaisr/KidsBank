import { useTranslation } from 'react-i18next';
import type { DemoTaskState, DemoTransaction, DemoTransferRecipient } from '../data/demoBaseline';
import { useDemoState } from '../context/DemoStateContext';
import { usePreferences } from '../context/PreferencesContext';
import {
  formatCurrency,
  formatNumber,
  formatPiggyDepositDate,
  getIntlLocale,
} from '../lib/format';
import { transferRecipientDisplayName } from '../lib/transferRecipients';
import { isTransactionCredit, transactionCurrency } from '../lib/transactions';

type TransactionRowProps = {
  transaction: DemoTransaction;
  /** When `time`, subtitle is clock only (for grouped parent spending history). */
  subtitleMode?: 'relative' | 'time';
};

export function TransactionRow({ transaction, subtitleMode = 'relative' }: TransactionRowProps) {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo } = useDemoState();
  const isCredit = isTransactionCredit(transaction);
  const currency = transactionCurrency(transaction);
  const title = getTransactionTitle(transaction, demo.tasks, demo.transferRecipients, t);
  const subtitle =
    subtitleMode === 'time'
      ? new Intl.DateTimeFormat(getIntlLocale(locale), {
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(transaction.at))
      : formatPiggyDepositDate(new Date(transaction.at), locale, {
          today: t('ui.piggy.dayToday'),
          yesterday: t('ui.piggy.dayYesterday'),
        });

  return (
    <article className="flex items-center gap-3 rounded-card bg-surface px-4 py-3 shadow-sm">
      <TxIcon transaction={transaction} />
      <div className="min-w-0 flex-1">
        <p className="font-heading text-sm font-semibold text-text">{title}</p>
        <p className="text-xs text-text-muted">{subtitle}</p>
      </div>
      {currency === 'STARS' ? (
        <p className="shrink-0 font-heading text-sm font-semibold text-primary">
          +{formatNumber(transaction.amount, locale)} ★
        </p>
      ) : (
        <p
          className={`shrink-0 font-heading text-sm font-semibold ${
            isCredit ? 'text-primary' : 'text-text'
          }`}
        >
          {isCredit ? '+' : '−'}
          {formatCurrency(transaction.amount, locale)}
        </p>
      )}
    </article>
  );
}

function getTransactionTitle(
  transaction: DemoTransaction,
  tasks: DemoTaskState[],
  transferRecipients: DemoTransferRecipient[],
  t: (key: string, options?: Record<string, string>) => string,
): string {
  if (transaction.typeId === 'childToParent' && transaction.transferRecipientId) {
    const recipient = transferRecipients.find(
      (item) => item.id === transaction.transferRecipientId,
    );
    if (recipient) {
      return t('ui.transactions.childTransfer', {
        name: transferRecipientDisplayName(recipient, t),
      });
    }
  }
  if (transaction.typeId === 'taskReward') {
    const task = transaction.taskId
      ? tasks.find((item) => item.id === transaction.taskId)
      : undefined;
    const templateId = task?.templateId ?? transaction.taskTemplateId;
    const customTitle = task?.customTitle;
    const taskTitle =
      customTitle ??
      (templateId ? t(`demo.tasks.${templateId}.title`) : t('demo.transactions.taskReward'));
    return t('ui.transactions.taskLabel', { task: taskTitle });
  }

  if (transaction.typeId === 'spend' && transaction.merchantKey) {
    const merchant = t(`demo.merchants.${transaction.merchantKey}`);
    if (transaction.merchantKey === 'sweetShop') {
      return t('ui.transactions.qrSpend', { merchant });
    }
    return merchant;
  }

  return t(`demo.transactions.${transaction.typeId}`);
}

function TxIcon({ transaction }: { transaction: DemoTransaction }) {
  const { t } = useTranslation();
  const { typeId } = transaction;

  if (typeId === 'taskReward') {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7 12.5l3 3 7-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (typeId === 'spend') {
    if (transaction.merchantKey === 'supermarket') {
      return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              d="M6 7h12l-1 13H7L6 7Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    }

    if (transaction.merchantKey === 'arcade') {
      return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="4" y="8" width="16" height="8" rx="2" stroke="currentColor" strokeWidth="1.7" />
            <path d="M8 12h.01M11 11v2M14 12h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 8V6M17 8V6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </div>
      );
    }

    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      </div>
    );
  }

  if (typeId === 'piggyCashback') {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="8" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 8V5M8.5 5h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M12 12v4M10 14h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (typeId === 'piggyGiftMom') {
    return <InitialAvatar label={t('demo.piggy.giftMom.initial')} tone="amber" />;
  }

  if (typeId === 'piggyGiftGrandma') {
    return <InitialAvatar label={t('demo.piggy.giftGrandma.initial')} tone="violet" />;
  }

  if (typeId === 'parentToCard') {
    return <InitialAvatar label={t('demo.piggy.giftMom.initial')} tone="amber" />;
  }

  if (typeId === 'cardToPiggy') {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M16 8.2c.4-.3.7-.8.7-1.4 0-.9-.8-1.6-1.7-1.6-.5 0-1 .2-1.3.6C13.2 5.3 12.6 5 12 5c-3.4 0-6.2 2.5-6.8 5.8H4.5A1.5 1.5 0 0 0 3 12.3V14a1 1 0 0 0 1 1h.6c.4 1.8 1.8 3.3 3.6 4v1.2a.8.8 0 0 0 .8.8h1.2a.8.8 0 0 0 .8-.8V19h2.2v1.2a.8.8 0 0 0 .8.8h1.2a.8.8 0 0 0 .8-.8V19c1.5-.6 2.6-1.8 3.2-3.3.8-.2 1.8-1.1 1.8-2.4 0-1-.6-1.8-1.4-2.2V11c0-1.2-.8-2.2-1.8-2.8Z"
            fill="currentColor"
          />
        </svg>
      </div>
    );
  }

  if (typeId === 'piggyToCard') {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M2 10h20" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-primary">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 5v14M5 12h14"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function InitialAvatar({
  label,
  tone,
}: {
  label: string;
  tone: 'amber' | 'violet';
}) {
  const toneClass =
    tone === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-violet-100 text-violet-600';

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-heading text-sm font-semibold ${toneClass}`}
    >
      {label}
    </div>
  );
}
