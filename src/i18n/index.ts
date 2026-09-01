import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import hy from '../locales/hy.json';
import ru from '../locales/ru.json';
import en from '../locales/en.json';
import presenterHy from '../locales/presenter.hy.json';
import presenterRu from '../locales/presenter.ru.json';
import presenterEn from '../locales/presenter.en.json';
import type { Locale } from '../context/preferences';

function getInitialLocale(): Locale {
  const lang = document.documentElement.lang;
  if (lang === 'hy' || lang === 'ru' || lang === 'en') {
    return lang;
  }
  return 'ru';
}

function withPresenter<T extends { ui: Record<string, unknown> }>(
  base: T,
  presenter: typeof presenterRu,
): T {
  return {
    ...base,
    ui: {
      ...base.ui,
      presenter,
    },
  };
}

void i18n.use(initReactI18next).init({
  resources: {
    hy: { translation: withPresenter(hy, presenterHy) },
    ru: { translation: withPresenter(ru, presenterRu) },
    en: { translation: withPresenter(en, presenterEn) },
  },
  lng: getInitialLocale(),
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
