import { useTranslation } from 'react-i18next';
import { ChildPageTitle } from '../components/ChildPageTitle';
import { TransactionRow } from '../components/TransactionRow';
import { useDemoState } from '../context/DemoStateContext';

export function ChildTransactionsPage() {
  const { t } = useTranslation();
  const { demo } = useDemoState();

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <ChildPageTitle titleKey="ui.nav.transactions" />
      <div className="space-y-2 px-4 py-4">
        {demo.transactions.length > 0 ? (
          demo.transactions.map((tx) => <TransactionRow key={tx.id} transaction={tx} />)
        ) : (
          <div className="rounded-card border border-border bg-surface p-5">
            <p className="text-sm leading-relaxed text-text-muted">{t('ui.transactions.empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
