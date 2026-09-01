import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import i18n from '../i18n';
import {
  applyDocumentPreferences,
  readInitialPreferences,
  STORAGE_KEYS,
  syncUrlParams,
  type Bank,
  type CardSkin,
  type Locale,
  type Role,
} from './preferences';

type PreferencesContextValue = {
  bank: Bank;
  locale: Locale;
  role: Role;
  cardSkin: CardSkin;
  setBank: (bank: Bank) => void;
  setLocale: (locale: Locale) => void;
  setRole: (role: Role) => void;
  setCardSkin: (cardSkin: CardSkin) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState(readInitialPreferences);

  const persistBankLocale = useCallback((bank: Bank, locale: Locale, cardSkin: CardSkin) => {
    try {
      localStorage.setItem(STORAGE_KEYS.bank, bank);
      localStorage.setItem(STORAGE_KEYS.lang, locale);
    } catch {
      // localStorage may be unavailable in private mode
    }
    applyDocumentPreferences(bank, locale, cardSkin);
    void i18n.changeLanguage(locale);
    syncUrlParams(bank, locale);
  }, []);

  const setBank = useCallback(
    (bank: Bank) => {
      setPrefs((current) => {
        const next = { ...current, bank };
        persistBankLocale(next.bank, next.locale, next.cardSkin);
        return next;
      });
    },
    [persistBankLocale],
  );

  const setLocale = useCallback(
    (locale: Locale) => {
      setPrefs((current) => {
        const next = { ...current, locale };
        persistBankLocale(next.bank, next.locale, next.cardSkin);
        return next;
      });
    },
    [persistBankLocale],
  );

  const setCardSkin = useCallback((cardSkin: CardSkin) => {
    setPrefs((current) => {
      const next = { ...current, cardSkin };
      try {
        localStorage.setItem(STORAGE_KEYS.cardSkin, cardSkin);
      } catch {
        // ignore
      }
      applyDocumentPreferences(next.bank, next.locale, next.cardSkin);
      return next;
    });
  }, []);

  const setRole = useCallback(
    (role: Role) => {
      setPrefs((current) => ({ ...current, role }));
      try {
        localStorage.setItem(STORAGE_KEYS.role, role);
      } catch {
        // ignore
      }
      navigate(role === 'child' ? '/child' : '/parent');
    },
    [navigate],
  );

  useEffect(() => {
    persistBankLocale(prefs.bank, prefs.locale, prefs.cardSkin);
  }, [persistBankLocale, prefs.bank, prefs.locale, prefs.cardSkin]);

  const value = useMemo(
    () => ({
      bank: prefs.bank,
      locale: prefs.locale,
      role: prefs.role,
      cardSkin: prefs.cardSkin,
      setBank,
      setLocale,
      setRole,
      setCardSkin,
    }),
    [prefs.bank, prefs.locale, prefs.role, prefs.cardSkin, setBank, setLocale, setRole, setCardSkin],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return context;
}
