export const SCREENSHOT_PLATFORMS = ['ios', 'android'] as const;
export type ScreenshotPlatform = (typeof SCREENSHOT_PLATFORMS)[number];

export const SCREENSHOT_LOCALES = [
  'de',
  'en',
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
export type ScreenshotLocale = (typeof SCREENSHOT_LOCALES)[number];

export const SCREENSHOT_NAMES = ['peptide', 'blend', 'reconstitution'] as const;
export type ScreenshotName = (typeof SCREENSHOT_NAMES)[number];

const SCREENSHOTS: Record<
  ScreenshotPlatform,
  Record<ScreenshotLocale, Record<ScreenshotName, number>>
> = {
  ios: {
    de: {
      peptide: require('@/assets/screenshots/ios/de/01-peptide.png'),
      blend: require('@/assets/screenshots/ios/de/02-blend.png'),
      reconstitution: require('@/assets/screenshots/ios/de/03-reconstitution.png'),
    },
    en: {
      peptide: require('@/assets/screenshots/ios/en/01-peptide.png'),
      blend: require('@/assets/screenshots/ios/en/02-blend.png'),
      reconstitution: require('@/assets/screenshots/ios/en/03-reconstitution.png'),
    },
    es: {
      peptide: require('@/assets/screenshots/ios/es/01-peptide.png'),
      blend: require('@/assets/screenshots/ios/es/02-blend.png'),
      reconstitution: require('@/assets/screenshots/ios/es/03-reconstitution.png'),
    },
    fr: {
      peptide: require('@/assets/screenshots/ios/fr/01-peptide.png'),
      blend: require('@/assets/screenshots/ios/fr/02-blend.png'),
      reconstitution: require('@/assets/screenshots/ios/fr/03-reconstitution.png'),
    },
    hi: {
      peptide: require('@/assets/screenshots/ios/hi/01-peptide.png'),
      blend: require('@/assets/screenshots/ios/hi/02-blend.png'),
      reconstitution: require('@/assets/screenshots/ios/hi/03-reconstitution.png'),
    },
    it: {
      peptide: require('@/assets/screenshots/ios/it/01-peptide.png'),
      blend: require('@/assets/screenshots/ios/it/02-blend.png'),
      reconstitution: require('@/assets/screenshots/ios/it/03-reconstitution.png'),
    },
    ja: {
      peptide: require('@/assets/screenshots/ios/ja/01-peptide.png'),
      blend: require('@/assets/screenshots/ios/ja/02-blend.png'),
      reconstitution: require('@/assets/screenshots/ios/ja/03-reconstitution.png'),
    },
    ko: {
      peptide: require('@/assets/screenshots/ios/ko/01-peptide.png'),
      blend: require('@/assets/screenshots/ios/ko/02-blend.png'),
      reconstitution: require('@/assets/screenshots/ios/ko/03-reconstitution.png'),
    },
    nl: {
      peptide: require('@/assets/screenshots/ios/nl/01-peptide.png'),
      blend: require('@/assets/screenshots/ios/nl/02-blend.png'),
      reconstitution: require('@/assets/screenshots/ios/nl/03-reconstitution.png'),
    },
    pl: {
      peptide: require('@/assets/screenshots/ios/pl/01-peptide.png'),
      blend: require('@/assets/screenshots/ios/pl/02-blend.png'),
      reconstitution: require('@/assets/screenshots/ios/pl/03-reconstitution.png'),
    },
    pt: {
      peptide: require('@/assets/screenshots/ios/pt/01-peptide.png'),
      blend: require('@/assets/screenshots/ios/pt/02-blend.png'),
      reconstitution: require('@/assets/screenshots/ios/pt/03-reconstitution.png'),
    },
    ro: {
      peptide: require('@/assets/screenshots/ios/ro/01-peptide.png'),
      blend: require('@/assets/screenshots/ios/ro/02-blend.png'),
      reconstitution: require('@/assets/screenshots/ios/ro/03-reconstitution.png'),
    },
    ru: {
      peptide: require('@/assets/screenshots/ios/ru/01-peptide.png'),
      blend: require('@/assets/screenshots/ios/ru/02-blend.png'),
      reconstitution: require('@/assets/screenshots/ios/ru/03-reconstitution.png'),
    },
    th: {
      peptide: require('@/assets/screenshots/ios/th/01-peptide.png'),
      blend: require('@/assets/screenshots/ios/th/02-blend.png'),
      reconstitution: require('@/assets/screenshots/ios/th/03-reconstitution.png'),
    },
    tr: {
      peptide: require('@/assets/screenshots/ios/tr/01-peptide.png'),
      blend: require('@/assets/screenshots/ios/tr/02-blend.png'),
      reconstitution: require('@/assets/screenshots/ios/tr/03-reconstitution.png'),
    },
    uk: {
      peptide: require('@/assets/screenshots/ios/uk/01-peptide.png'),
      blend: require('@/assets/screenshots/ios/uk/02-blend.png'),
      reconstitution: require('@/assets/screenshots/ios/uk/03-reconstitution.png'),
    },
    vi: {
      peptide: require('@/assets/screenshots/ios/vi/01-peptide.png'),
      blend: require('@/assets/screenshots/ios/vi/02-blend.png'),
      reconstitution: require('@/assets/screenshots/ios/vi/03-reconstitution.png'),
    },
    zh: {
      peptide: require('@/assets/screenshots/ios/zh/01-peptide.png'),
      blend: require('@/assets/screenshots/ios/zh/02-blend.png'),
      reconstitution: require('@/assets/screenshots/ios/zh/03-reconstitution.png'),
    },
  },
  android: {
    de: {
      peptide: require('@/assets/screenshots/android/de/01-peptide.png'),
      blend: require('@/assets/screenshots/android/de/02-blend.png'),
      reconstitution: require('@/assets/screenshots/android/de/03-reconstitution.png'),
    },
    en: {
      peptide: require('@/assets/screenshots/android/en/01-peptide.png'),
      blend: require('@/assets/screenshots/android/en/02-blend.png'),
      reconstitution: require('@/assets/screenshots/android/en/03-reconstitution.png'),
    },
    es: {
      peptide: require('@/assets/screenshots/android/es/01-peptide.png'),
      blend: require('@/assets/screenshots/android/es/02-blend.png'),
      reconstitution: require('@/assets/screenshots/android/es/03-reconstitution.png'),
    },
    fr: {
      peptide: require('@/assets/screenshots/android/fr/01-peptide.png'),
      blend: require('@/assets/screenshots/android/fr/02-blend.png'),
      reconstitution: require('@/assets/screenshots/android/fr/03-reconstitution.png'),
    },
    hi: {
      peptide: require('@/assets/screenshots/android/hi/01-peptide.png'),
      blend: require('@/assets/screenshots/android/hi/02-blend.png'),
      reconstitution: require('@/assets/screenshots/android/hi/03-reconstitution.png'),
    },
    it: {
      peptide: require('@/assets/screenshots/android/it/01-peptide.png'),
      blend: require('@/assets/screenshots/android/it/02-blend.png'),
      reconstitution: require('@/assets/screenshots/android/it/03-reconstitution.png'),
    },
    ja: {
      peptide: require('@/assets/screenshots/android/ja/01-peptide.png'),
      blend: require('@/assets/screenshots/android/ja/02-blend.png'),
      reconstitution: require('@/assets/screenshots/android/ja/03-reconstitution.png'),
    },
    ko: {
      peptide: require('@/assets/screenshots/android/ko/01-peptide.png'),
      blend: require('@/assets/screenshots/android/ko/02-blend.png'),
      reconstitution: require('@/assets/screenshots/android/ko/03-reconstitution.png'),
    },
    nl: {
      peptide: require('@/assets/screenshots/android/nl/01-peptide.png'),
      blend: require('@/assets/screenshots/android/nl/02-blend.png'),
      reconstitution: require('@/assets/screenshots/android/nl/03-reconstitution.png'),
    },
    pl: {
      peptide: require('@/assets/screenshots/android/pl/01-peptide.png'),
      blend: require('@/assets/screenshots/android/pl/02-blend.png'),
      reconstitution: require('@/assets/screenshots/android/pl/03-reconstitution.png'),
    },
    pt: {
      peptide: require('@/assets/screenshots/android/pt/01-peptide.png'),
      blend: require('@/assets/screenshots/android/pt/02-blend.png'),
      reconstitution: require('@/assets/screenshots/android/pt/03-reconstitution.png'),
    },
    ro: {
      peptide: require('@/assets/screenshots/android/ro/01-peptide.png'),
      blend: require('@/assets/screenshots/android/ro/02-blend.png'),
      reconstitution: require('@/assets/screenshots/android/ro/03-reconstitution.png'),
    },
    ru: {
      peptide: require('@/assets/screenshots/android/ru/01-peptide.png'),
      blend: require('@/assets/screenshots/android/ru/02-blend.png'),
      reconstitution: require('@/assets/screenshots/android/ru/03-reconstitution.png'),
    },
    th: {
      peptide: require('@/assets/screenshots/android/th/01-peptide.png'),
      blend: require('@/assets/screenshots/android/th/02-blend.png'),
      reconstitution: require('@/assets/screenshots/android/th/03-reconstitution.png'),
    },
    tr: {
      peptide: require('@/assets/screenshots/android/tr/01-peptide.png'),
      blend: require('@/assets/screenshots/android/tr/02-blend.png'),
      reconstitution: require('@/assets/screenshots/android/tr/03-reconstitution.png'),
    },
    uk: {
      peptide: require('@/assets/screenshots/android/uk/01-peptide.png'),
      blend: require('@/assets/screenshots/android/uk/02-blend.png'),
      reconstitution: require('@/assets/screenshots/android/uk/03-reconstitution.png'),
    },
    vi: {
      peptide: require('@/assets/screenshots/android/vi/01-peptide.png'),
      blend: require('@/assets/screenshots/android/vi/02-blend.png'),
      reconstitution: require('@/assets/screenshots/android/vi/03-reconstitution.png'),
    },
    zh: {
      peptide: require('@/assets/screenshots/android/zh/01-peptide.png'),
      blend: require('@/assets/screenshots/android/zh/02-blend.png'),
      reconstitution: require('@/assets/screenshots/android/zh/03-reconstitution.png'),
    },
  },
};

export const getScreenshotSource = ({
  platform,
  locale,
  name,
}: {
  platform: ScreenshotPlatform;
  locale: ScreenshotLocale;
  name: ScreenshotName;
}): number => {
  return SCREENSHOTS[platform][locale][name];
};
