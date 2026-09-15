import { useTranslation } from 'react-i18next';
import type { DemoTransaction } from '../data/demoBaseline';
import { formatCurrency, formatPiggyDepositDate } from '../lib/format';
import { usePreferences } from '../context/PreferencesContext';

type PiggyDepositRowProps = {
  transaction: DemoTransaction;
  variant?: 'default' | 'young';
};

const YOUNG_PIGGY_TITLE_KEYS: Partial<Record<DemoTransaction['typeId'], string>> = {
  piggyGiftMom: 'ui.childYoung.piggy.txFromMom',
  piggyGiftGrandma: 'ui.childYoung.piggy.txFromGrandma',
  piggyCashback: 'ui.childYoung.piggy.txCashback',
  cardToPiggy: 'ui.childYoung.piggy.txFromCard',
  parentToPiggy: 'ui.childYoung.piggy.txFromParent',
};

export function PiggyDepositRow({ transaction, variant = 'default' }: PiggyDepositRowProps) {
  const { t } = useTranslation();
  const { locale } = usePreferences();

  const titleKey = variant === 'young' ? YOUNG_PIGGY_TITLE_KEYS[transaction.typeId] : undefined;
  const title = titleKey ? t(titleKey) : t(`demo.transactions.${transaction.typeId}`);

  return (
    <article className="flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3">
      <DepositIcon typeId={transaction.typeId} />
      <div className="min-w-0 flex-1">
        <p className="font-heading text-sm font-semibold text-text">{title}</p>
        {variant === 'default' ? (
          <p className="text-xs text-text-muted">
            {formatPiggyDepositDate(new Date(transaction.at), locale, {
              today: t('ui.piggy.dayToday'),
              yesterday: t('ui.piggy.dayYesterday'),
            })}
          </p>
        ) : null}
      </div>
      <p className="shrink-0 font-heading text-sm font-semibold text-primary">
        +{formatCurrency(transaction.amount, locale)}
      </p>
    </article>
  );
}

function DepositIcon({ typeId }: { typeId: DemoTransaction['typeId'] }) {
  const { t } = useTranslation();

  if (typeId === 'piggyCashback') {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="8" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 8V5M8.5 5h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M12 12v4M10 14h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (typeId === 'piggyGiftMom') {
    return (
      <InitialAvatar label={t('demo.piggy.giftMom.initial')} tone="rose" />
    );
  }

  if (typeId === 'piggyGiftGrandma') {
    return (
      <InitialAvatar label={t('demo.piggy.giftGrandma.initial')} tone="violet" />
    );
  }

  if (typeId === 'cardToPiggy') {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M2 10h20" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M16 8.2c.4-.3.7-.8.7-1.4 0-.9-.8-1.6-1.7-1.6-.5 0-1 .2-1.3.6C13.2 5.3 12.6 5 12 5c-3.4 0-6.2 2.5-6.8 5.8H4.5A1.5 1.5 0 0 0 3 12.3V14a1 1 0 0 0 1 1h.6c.4 1.8 1.8 3.3 3.6 4v1.2a.8.8 0 0 0 .8.8h1.2a.8.8 0 0 0 .8-.8V19h2.2v1.2a.8.8 0 0 0 .8.8h1.2a.8.8 0 0 0 .8-.8V19c1.5-.6 2.6-1.8 3.2-3.3.8-.2 1.8-1.1 1.8-2.4 0-1-.6-1.8-1.4-2.2V11c0-1.2-.8-2.2-1.8-2.8Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function InitialAvatar({ label, tone }: { label: string; tone: 'rose' | 'violet' }) {
  const toneClass =
    tone === 'rose' ? 'bg-rose-100 text-rose-600' : 'bg-violet-100 text-violet-600';

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-heading text-sm font-semibold ${toneClass}`}
    >
      {label}
    </div>
  );
}
