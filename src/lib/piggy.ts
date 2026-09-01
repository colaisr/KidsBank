import type { Bank } from '../context/preferences';

export function getPiggyShareUrl(bank: Bank, shareSlug: string): string {
  const host = bank === 'amio' ? 'amio.am' : 'evoca.am';
  return `${host}/kopilka/${shareSlug}`;
}
