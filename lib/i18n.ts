import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from '@/locales/de/translation.json';
import en from '@/locales/en/translation.json';
import es from '@/locales/es/translation.json';
import fr from '@/locales/fr/translation.json';
import hi from '@/locales/hi/translation.json';
import it from '@/locales/it/translation.json';
import ja from '@/locales/ja/translation.json';
import ko from '@/locales/ko/translation.json';
import nl from '@/locales/nl/translation.json';
import pl from '@/locales/pl/translation.json';
import pt from '@/locales/pt/translation.json';
import ro from '@/locales/ro/translation.json';
import ru from '@/locales/ru/translation.json';
import th from '@/locales/th/translation.json';
import tr from '@/locales/tr/translation.json';
import uk from '@/locales/uk/translation.json';
import vi from '@/locales/vi/translation.json';
import zh from '@/locales/zh/translation.json';

export const SUPPORTED_LOCALES = [
  'en',
  'de',
  'es',
  'fr',
  'hi',
  'it',
  'ja',
  'ko',
  'nl',
  'pl',
  'pt',
  'ro',
  'ru',
  'th',
  'tr',
  'uk',
  'vi',
  'zh',
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_DISPLAY_NAMES: Record<SupportedLocale, string> = {
  en: '🇺🇸 English',
  de: '🇩🇪 Deutsch',
  es: '🇪🇸 Español',
  fr: '🇫🇷 Français',
  hi: '🇮🇳 हिन्दी',
  it: '🇮🇹 Italiano',
  ja: '🇯🇵 日本語',
  ko: '🇰🇷 한국어',
  nl: '🇳🇱 Nederlands',
  pl: '🇵🇱 Polski',
  pt: '🇧🇷 Português',
  ro: '🇷🇴 Română',
  ru: '🇷🇺 Русский',
  th: '🇹🇭 ไทย',
  tr: '🇹🇷 Türkçe',
  uk: '🇺🇦 Українська',
  vi: '🇻🇳 Tiếng Việt',
  zh: '🇨🇳 中文',
};

export const getDeviceLanguage = () => getLocales()[0]?.languageCode ?? 'en';

const deviceLanguage = getDeviceLanguage();

// eslint-disable-next-line import/no-named-as-default-member
void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
    es: { translation: es },
    fr: { translation: fr },
    hi: { translation: hi },
    it: { translation: it },
    ja: { translation: ja },
    ko: { translation: ko },
    nl: { translation: nl },
    pl: { translation: pl },
    pt: { translation: pt },
    ro: { translation: ro },
    ru: { translation: ru },
    th: { translation: th },
    tr: { translation: tr },
    uk: { translation: uk },
    vi: { translation: vi },
    zh: { translation: zh },
  },
  lng: deviceLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
