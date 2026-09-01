import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { TransactionFilter } from '../lib/transactions';
import { HeaderPresenterActions } from './HeaderPresenterActions';

type ChildTransactionsHeaderProps = {
  filter: TransactionFilter;
  onFilterChange: (filter: TransactionFilter) => void;
  weekSummaryLabel: string;
};

const FILTERS: TransactionFilter[] = ['all', 'income', 'expenses'];

export function ChildTransactionsHeader({
  filter,
  onFilterChange,
  weekSummaryLabel,
}: ChildTransactionsHeaderProps) {
  const { t } = useTranslation();

  return (
    <header
      className="rounded-b-3xl px-4 pb-4 pt-3 text-white shadow-md"
      style={{ background: 'var(--kb-header-gradient)' }}
    >
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/child/goals"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white transition-colors duration-200 hover:bg-white/25"
          aria-label={t('ui.home.stars')}
        >
          <StarIcon />
        </Link>
        <h1 className="min-w-0 flex-1 text-center font-heading text-lg font-semibold">
          {t('ui.nav.transactions')}
        </h1>
        <HeaderPresenterActions presenterId="child-transactions" variant="onGradient" />
      </div>

      <div className="mt-4 flex gap-2">
        {FILTERS.map((key) => {
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onFilterChange(key)}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors duration-200 ${
                active
                  ? 'bg-white text-primary shadow-sm'
                  : 'bg-white/15 text-white/90 hover:bg-white/25'
              }`}
            >
              {t(`ui.transactions.filter.${key}`)}
            </button>
          );
        })}
      </div>

      <p className="mt-3 rounded-2xl bg-white/15 px-3 py-2 text-center text-xs font-medium text-white/95">
        {weekSummaryLabel}
      </p>
    </header>
  );
}

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.9 6.5 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7-5.4-4.7 7.1-.6L12 2.5Z" />
    </svg>
  );
}
