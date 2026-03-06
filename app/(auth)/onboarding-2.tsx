import { OnboardingAppScreenshot } from '@/components/screens/onboarding/onboarding-app-screenshot';
import { getScreenshotSource, SCREENSHOT_LOCALES, ScreenshotLocale } from '@/components/screenshot-assets';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

export default function Onboarding2Screen() {
  const { t, i18n } = useTranslation();

  const platform = Platform.OS === 'ios' ? 'ios' : 'android';
  const locale = SCREENSHOT_LOCALES.includes(i18n.language as ScreenshotLocale)
    ? (i18n.language as ScreenshotLocale)
    : 'en';

  return (
    <OnboardingAppScreenshot
      currentHref="/(auth)/onboarding-2"
      source={getScreenshotSource({ platform, locale, name: 'peptide' })}
      title={t('onboarding.screen2.title')}
      subtitle={t('onboarding.screen2.subtitle')}
    />
  );
}
