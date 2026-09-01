import type { DemoTransaction, TransactionTypeId } from '../data/demoBaseline';

export type TransactionFilter = 'all' | 'income' | 'expenses';

const CREDIT_AMD_TYPE_IDS: TransactionTypeId[] = [
  'parentToCard',
  'parentToPiggy',
  'goalRedeem',
  'piggyCashback',
  'piggyGiftMom',
  'piggyGiftGrandma',
  'piggyToCard',
];

export function transactionCurrency(tx: DemoTransaction): 'AMD' | 'STARS' {
  return tx.currency ?? 'AMD';
}

export function isTransactionCredit(tx: DemoTransaction): boolean {
  if (tx.typeId === 'taskReward') {
    return true;
  }
  return CREDIT_AMD_TYPE_IDS.includes(tx.typeId);
}

export function matchesTransactionFilter(
  tx: DemoTransaction,
  filter: TransactionFilter,
): boolean {
  if (filter === 'all') {
    return true;
  }
  if (filter === 'income') {
    return isTransactionCredit(tx);
  }
  return transactionCurrency(tx) === 'AMD' && !isTransactionCredit(tx);
}

export type WeekSummary = {
  creditAmd: number;
  debitAmd: number;
  creditStars: number;
};

export function getWeekStart(date: Date): Date {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  return start;
}

export function isInCurrentWeek(at: string, now = new Date()): boolean {
  const date = new Date(at);
  const weekStart = getWeekStart(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  return date >= weekStart && date < weekEnd;
}

export function computeWeekSummary(transactions: DemoTransaction[]): WeekSummary {
  const summary: WeekSummary = { creditAmd: 0, debitAmd: 0, creditStars: 0 };

  for (const tx of transactions) {
    if (!isInCurrentWeek(tx.at)) {
      continue;
    }

    if (tx.typeId === 'taskReward') {
      summary.creditStars += tx.amount;
      continue;
    }

    if (transactionCurrency(tx) !== 'AMD') {
      continue;
    }

    if (isTransactionCredit(tx)) {
      summary.creditAmd += tx.amount;
    } else {
      summary.debitAmd += tx.amount;
    }
  }

  return summary;
}
