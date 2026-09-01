import type { Locale } from '../context/preferences';

const LOCALE_MAP: Record<Locale, string> = {
  hy: 'hy-AM',
  ru: 'ru-RU',
  en: 'en-US',
};

export function getIntlLocale(locale: Locale): string {
  return LOCALE_MAP[locale];
}

export function formatCurrency(amount: number, locale: Locale, currency = 'AMD'): string {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
