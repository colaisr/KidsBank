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
  type Locale,
  type Role,
} from './preferences';

type PreferencesContextValue = {
  bank: Bank;
  locale: Locale;
  role: Role;
  setBank: (bank: Bank) => void;
  setLocale: (locale: Locale) => void;
  setRole: (role: Role) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState(readInitialPreferences);

  const persistBankLocale = useCallback((bank: Bank, locale: Locale) => {
    try {
      localStorage.setItem(STORAGE_KEYS.bank, bank);
      localStorage.setItem(STORAGE_KEYS.lang, locale);
    } catch {
      // localStorage may be unavailable in private mode
    }
    applyDocumentPreferences(bank, locale);
    void i18n.changeLanguage(locale);
    syncUrlParams(bank, locale);
  }, []);

  const setBank = useCallback(
    (bank: Bank) => {
      setPrefs((current) => {
        const next = { ...current, bank };
        persistBankLocale(next.bank, next.locale);
        return next;
      });
    },
    [persistBankLocale],
  );

  const setLocale = useCallback(
    (locale: Locale) => {
      setPrefs((current) => {
        const next = { ...current, locale };
        persistBankLocale(next.bank, next.locale);
        return next;
      });
    },
    [persistBankLocale],
  );

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
    persistBankLocale(prefs.bank, prefs.locale);
  }, [persistBankLocale, prefs.bank, prefs.locale]);

  const value = useMemo(
    () => ({
      bank: prefs.bank,
      locale: prefs.locale,
      role: prefs.role,
      setBank,
      setLocale,
      setRole,
    }),
    [prefs.bank, prefs.locale, prefs.role, setBank, setLocale, setRole],
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
