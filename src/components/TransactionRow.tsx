import { useTranslation } from 'react-i18next';
import type { DemoTransaction } from '../data/demoBaseline';
import { formatCurrency, formatDate } from '../lib/format';
import { usePreferences } from '../context/PreferencesContext';

type TransactionRowProps = {
  transaction: DemoTransaction;
};

export function TransactionRow({ transaction }: TransactionRowProps) {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const isCredit =
    transaction.typeId === 'parentToCard' ||
    transaction.typeId === 'parentToPiggy' ||
    transaction.typeId === 'goalRedeem' ||
    transaction.typeId === 'piggyCashback' ||
    transaction.typeId === 'piggyGiftMom' ||
    transaction.typeId === 'piggyGiftGrandma' ||
    transaction.typeId === 'piggyToCard';
  const sign = isCredit ? '+' : '−';

  return (
    <article className="flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
        <TxIcon typeId={transaction.typeId} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-heading text-sm font-semibold text-text">
          {t(`demo.transactions.${transaction.typeId}`)}
        </p>
        <p className="text-xs text-text-muted">
          {formatDate(new Date(transaction.at), locale)}
        </p>
      </div>
      <p
        className={`shrink-0 font-heading text-sm font-semibold ${
          isCredit ? 'text-primary' : 'text-text'
        }`}
      >
        {sign}
        {formatCurrency(transaction.amount, locale, 'AMD', transaction.typeId === 'spend' ? 0 : 0)}
      </p>
    </article>
  );
}

function TxIcon({ typeId }: { typeId: DemoTransaction['typeId'] }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {typeId === 'spend' ? (
        <path
          d="M6 6h15l-1.5 9h-12L6 6ZM6 6 5 3H2"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M12 5v14M5 12h14"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
