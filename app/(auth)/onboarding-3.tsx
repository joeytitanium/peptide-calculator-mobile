import { OnboardingAppScreenshot } from '@/components/screens/onboarding/onboarding-app-screenshot';
import { getScreenshotSource, SCREENSHOT_LOCALES, ScreenshotLocale } from '@/components/screenshot-assets';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

export default function Onboarding3Screen() {
  const { t, i18n } = useTranslation();

  const platform = Platform.OS === 'ios' ? 'ios' : 'android';
  const locale = SCREENSHOT_LOCALES.includes(i18n.language as ScreenshotLocale)
    ? (i18n.language as ScreenshotLocale)
    : 'en';

  return (
    <OnboardingAppScreenshot
      currentHref="/(auth)/onboarding-3"
      source={getScreenshotSource({ platform, locale, name: 'blend' })}
      title={t('onboarding.screen3.title')}
      subtitle={t('onboarding.screen3.subtitle')}
    />
  );
}
