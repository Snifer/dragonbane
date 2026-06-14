import { createI18n } from 'vue-i18n';
import enUS from './messages/en-US';
import esAR from './messages/es-AR';
import type { Locale } from '../components/models';

export const DEFAULT_LOCALE: Locale = 'en-US';
export const SUPPORTED_LOCALES: Locale[] = ['en-US', 'es-AR'];

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    'en-US': enUS,
    'es-AR': esAR,
  },
});

export const setLocale = (locale: Locale) => {
  i18n.global.locale.value = locale;
};
