import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import hy from '../locales/hy.json';
import ru from '../locales/ru.json';
import en from '../locales/en.json';
import type { Locale } from '../context/preferences';

function getInitialLocale(): Locale {
  const lang = document.documentElement.lang;
  if (lang === 'hy' || lang === 'ru' || lang === 'en') {
    return lang;
  }
  return 'ru';
}

void i18n.use(initReactI18next).init({
  resources: {
    hy: { translation: hy },
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: getInitialLocale(),
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
