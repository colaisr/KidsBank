import type { DemoTransaction } from '../data/demoBaseline';
import { getSpendingReport } from './parentSpendingReport';

export function isSpendTransaction(tx: DemoTransaction): boolean {
  return tx.typeId === 'spend';
}

export function isInCurrentMonth(at: string, now = new Date()): boolean {
  const date = new Date(at);
  return (
    date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
  );
}

export function computeMonthSpendTotal(
  transactions: DemoTransaction[],
  now = new Date(),
): number {
  return transactions
    .filter((tx) => isSpendTransaction(tx) && isInCurrentMonth(tx.at, now))
    .reduce((sum, tx) => sum + tx.amount, 0);
}

export function getMonthSummaryDonutSlices() {
  return getSpendingReport('month').slices;
}
