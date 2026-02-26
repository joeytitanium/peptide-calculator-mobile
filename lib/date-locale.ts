import {
  de,
  enUS,
  es,
  fr,
  hi,
  it,
  ja,
  ko,
  Locale,
  nl,
  pl,
  pt,
  ro,
  ru,
  th,
  tr,
  uk,
  vi,
  zhCN,
} from 'date-fns/locale';

const localeMap: Record<string, Locale> = {
  en: enUS,
  ko,
  es,
  pt,
  ja,
  zh: zhCN,
  de,
  fr,
  hi,
  it,
  tr,
  th,
  nl,
  pl,
  ro,
  ru,
  uk,
  vi,
};

export function getDateLocale(languageCode: string): Locale {
  return localeMap[languageCode] ?? enUS;
}
