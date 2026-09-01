import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChildTransactionsHeader } from '../components/ChildTransactionsHeader';
import { TransactionRow } from '../components/TransactionRow';
import { useDemoState } from '../context/DemoStateContext';
import { usePreferences } from '../context/PreferencesContext';
import {
  formatCurrency,
  formatNumber,
  getRelativeDayGroup,
  type RelativeDayGroup,
} from '../lib/format';
import {
  computeWeekSummary,
  matchesTransactionFilter,
  type TransactionFilter,
} from '../lib/transactions';

const GROUP_ORDER: RelativeDayGroup[] = ['today', 'yesterday', 'earlier'];

export function ChildTransactionsPage() {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo } = useDemoState();
  const [filter, setFilter] = useState<TransactionFilter>('all');

  const filtered = useMemo(
    () =>
      demo.transactions
        .filter((tx) => matchesTransactionFilter(tx, filter))
        .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()),
    [demo.transactions, filter],
  );

  const grouped = useMemo(() => {
    const groups = new Map<RelativeDayGroup, typeof filtered>();
    for (const tx of filtered) {
      const key = getRelativeDayGroup(new Date(tx.at));
      const bucket = groups.get(key) ?? [];
      bucket.push(tx);
      groups.set(key, bucket);
    }

    const labelFor = (key: RelativeDayGroup) => {
      if (key === 'today') {
        return t('ui.piggy.dayToday');
      }
      if (key === 'yesterday') {
        return t('ui.piggy.dayYesterday');
      }
      return t('ui.piggy.dayEarlier');
    };

    return GROUP_ORDER.filter((key) => groups.has(key)).map((key) => ({
      key,
      label: labelFor(key),
      items: groups.get(key) ?? [],
    }));
  }, [filtered, t]);

  const weekSummary = useMemo(
    () => computeWeekSummary(demo.transactions),
    [demo.transactions],
  );

  const weekSummaryLabel = t('ui.transactions.weekSummary', {
    credit: formatCurrency(weekSummary.creditAmd, locale),
    debit: formatCurrency(weekSummary.debitAmd, locale),
    stars: formatNumber(weekSummary.creditStars, locale),
  });

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <ChildTransactionsHeader
        filter={filter}
        onFilterChange={setFilter}
        weekSummaryLabel={weekSummaryLabel}
      />

      <div className="space-y-4 px-4 py-4">
        {grouped.length > 0 ? (
          grouped.map((group) => (
            <section key={group.key} className="space-y-2">
              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
                {group.label}
              </p>
              {group.items.map((tx) => <TransactionRow key={tx.id} transaction={tx} />)}
            </section>
          ))
        ) : (
          <div className="rounded-card bg-surface p-5 shadow-sm">
            <p className="text-sm leading-relaxed text-text-muted">
              {filter === 'expenses' ? t('ui.transactions.emptyExpenses') : t('ui.transactions.empty')}
            </p>
            {filter === 'expenses' ? (
              <Link
                to="/child/hub"
                className="mt-3 inline-flex text-sm font-semibold text-primary"
              >
                {t('ui.transactions.demoSpendCta')}
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
