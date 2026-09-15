import { readStoredChildExperience, type ChildExperience } from './childExperience';

export type Bank = 'amio' | 'evoca';
export type Locale = 'hy' | 'ru' | 'en';
export type Role = 'child' | 'parent';
export type CardSkin = 'ocean' | 'space' | 'dinosaurs' | 'unicorns' | 'robots' | 'racing';

export type { ChildExperience };

export const STORAGE_KEYS = {
  bank: 'kidsbank.bank',
  lang: 'kidsbank.lang',
  role: 'kidsbank.role',
  cardSkin: 'kidsbank.cardSkin',
  childExperience: 'kidsbank.childExperience',
} as const;

const VALID_BANKS: Bank[] = ['amio', 'evoca'];
const VALID_LOCALES: Locale[] = ['hy', 'ru', 'en'];
const VALID_ROLES: Role[] = ['child', 'parent'];
const VALID_CARD_SKINS: CardSkin[] = [
  'ocean',
  'space',
  'dinosaurs',
  'unicorns',
  'robots',
  'racing',
];

export const DEFAULT_BANK: Bank = 'amio';
export const DEFAULT_LOCALE: Locale = 'ru';
export const DEFAULT_ROLE: Role = 'child';
export const DEFAULT_CARD_SKIN: CardSkin = 'ocean';

export const CARD_SKINS: CardSkin[] = [...VALID_CARD_SKINS];

function readStoredCardSkin(): CardSkin {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.cardSkin) as CardSkin | null;
    if (stored && VALID_CARD_SKINS.includes(stored)) {
      return stored;
    }
  } catch {
    // localStorage may be unavailable
  }
  return DEFAULT_CARD_SKIN;
}

export function readInitialPreferences(): {
  bank: Bank;
  locale: Locale;
  role: Role;
  cardSkin: CardSkin;
  childExperience: ChildExperience;
} {
  const params = new URLSearchParams(window.location.search);

  let bank = params.get('bank') as Bank | null;
  let locale = params.get('lang') as Locale | null;

  if (!bank || !VALID_BANKS.includes(bank)) {
    try {
      bank = localStorage.getItem(STORAGE_KEYS.bank) as Bank | null;
    } catch {
      bank = null;
    }
  }

  if (!locale || !VALID_LOCALES.includes(locale)) {
    try {
      locale = localStorage.getItem(STORAGE_KEYS.lang) as Locale | null;
    } catch {
      locale = null;
    }
  }

  let role: Role = DEFAULT_ROLE;
  try {
    const storedRole = localStorage.getItem(STORAGE_KEYS.role) as Role | null;
    if (storedRole && VALID_ROLES.includes(storedRole)) {
      role = storedRole;
    }
  } catch {
    role = DEFAULT_ROLE;
  }

  return {
    bank: bank && VALID_BANKS.includes(bank) ? bank : DEFAULT_BANK,
    locale: locale && VALID_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE,
    role,
    cardSkin: readStoredCardSkin(),
    childExperience: readStoredChildExperience(),
  };
}

export function syncUrlParams(bank: Bank, locale: Locale): void {
  const params = new URLSearchParams(window.location.search);
  params.set('bank', bank);
  params.set('lang', locale);
  const query = params.toString();
  const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  window.history.replaceState(null, '', nextUrl);
}

export function applyDocumentPreferences(
  bank: Bank,
  locale: Locale,
  cardSkin: CardSkin = DEFAULT_CARD_SKIN,
): void {
  document.documentElement.setAttribute('data-theme', bank);
  document.documentElement.setAttribute('data-card-skin', cardSkin);
  document.documentElement.setAttribute('lang', locale);
  document.documentElement.setAttribute('dir', 'ltr');
}
