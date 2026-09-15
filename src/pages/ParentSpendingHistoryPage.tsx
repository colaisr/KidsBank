import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChildPageTitle } from '../components/ChildPageTitle';
import { ParentSpendingMiniDonut } from '../components/ParentSpendingMiniDonut';
import { TransactionRow } from '../components/TransactionRow';
import { useDemoState } from '../context/DemoStateContext';
import { usePreferences } from '../context/PreferencesContext';
import { formatCurrency, getRelativeDayGroup, type RelativeDayGroup } from '../lib/format';
import {
  computeMonthSpendTotal,
  getMonthSummaryDonutSlices,
  isSpendTransaction,
} from '../lib/parentSpendingHistory';

const GROUP_ORDER: RelativeDayGroup[] = ['today', 'yesterday', 'earlier'];

export function ParentSpendingHistoryPage() {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo } = useDemoState();

  const monthTotal = useMemo(
    () => computeMonthSpendTotal(demo.transactions),
    [demo.transactions],
  );
  const donutSlices = useMemo(() => getMonthSummaryDonutSlices(), []);

  const grouped = useMemo(() => {
    const spends = demo.transactions
      .filter(isSpendTransaction)
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

    const groups = new Map<RelativeDayGroup, typeof spends>();
    for (const tx of spends) {
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
  }, [demo.transactions, t]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-surface-muted">
      <ChildPageTitle
        titleKey="ui.parent.spendingHistoryScreen.title"
        backTo="/parent"
        showSettingsLink={false}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-8 pt-2">
        <div className="mb-5 flex items-center justify-between gap-4 rounded-card border border-border bg-surface px-4 py-4 shadow-sm">
          <div className="min-w-0">
            <p className="text-xs font-medium text-text-muted">
              {t('ui.parent.spendingHistoryScreen.monthSpentLabel')}
            </p>
            <p className="mt-1 font-heading text-2xl font-semibold tracking-tight text-text">
              {formatCurrency(monthTotal, locale)}
            </p>
          </div>
          <ParentSpendingMiniDonut slices={donutSlices} />
        </div>

        {grouped.length > 0 ? (
          <div className="space-y-4">
            {grouped.map((group) => (
              <section key={group.key} className="space-y-2">
                <p className="px-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  {group.label}
                </p>
                {group.items.map((tx) => (
                  <TransactionRow key={tx.id} transaction={tx} subtitleMode="time" />
                ))}
              </section>
            ))}
          </div>
        ) : (
          <div className="rounded-card border border-border bg-surface p-5">
            <p className="text-sm text-text-muted">{t('ui.transactions.emptyExpenses')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
