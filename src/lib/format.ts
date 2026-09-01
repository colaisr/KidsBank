import type { Locale } from '../context/preferences';

const LOCALE_MAP: Record<Locale, string> = {
  hy: 'hy-AM',
  ru: 'ru-RU',
  en: 'en-US',
};

export function getIntlLocale(locale: Locale): string {
  return LOCALE_MAP[locale];
}

export function formatCurrency(
  amount: number,
  locale: Locale,
  currency = 'AMD',
  maximumFractionDigits = 0,
): string {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    style: 'currency',
    currency,
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits > 0 ? maximumFractionDigits : 0,
  }).format(amount);
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export type RelativeDayGroup = 'today' | 'yesterday' | 'earlier';

export function getRelativeDayGroup(date: Date): RelativeDayGroup {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfDate.getTime()) / (24 * 60 * 60 * 1000),
  );

  if (diffDays === 0) {
    return 'today';
  }
  if (diffDays === 1) {
    return 'yesterday';
  }
  return 'earlier';
}

export function formatDateTime(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatPiggyDepositDate(date: Date, locale: Locale, labels: {
  today: string;
  yesterday: string;
}): string {
  const group = getRelativeDayGroup(date);
  const time = new Intl.DateTimeFormat(getIntlLocale(locale), {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

  if (group === 'today') {
    return `${labels.today}, ${time}`;
  }
  if (group === 'yesterday') {
    return `${labels.yesterday}, ${time}`;
  }

  return formatDateTime(date, locale);
}
