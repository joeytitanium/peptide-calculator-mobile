import { OnboardingWelcomeFullBleedImage } from '@/components/screens/onboarding/onboarding-welcome-full-bleed-image';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

const OnboardingWelcome = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <OnboardingWelcomeFullBleedImage
      onPresentPaywall={() => router.push('/(auth)/paywall')}
      currentHref="/(auth)/onboarding-welcome"
      colorScheme="light"
      textPosition="top"
      title={t('onboarding.welcome.title')}
      subtitle={t('onboarding.welcome.subtitle')}
      topGradientHidden
    />
  );
};

export default OnboardingWelcome;
