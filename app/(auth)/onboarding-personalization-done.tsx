import { OnboardingPersonalizationDone as OnboardingPersonalizationDoneScreen } from '@/components/screens/onboarding/onboarding-personalization-done';
import { useTranslation } from 'react-i18next';

export default function OnboardingPersonalizationDone() {
  const { t } = useTranslation();

  return (
    <OnboardingPersonalizationDoneScreen
      currentHref="/(auth)/onboarding-personalization-done"
      title={t('onboarding.personalizationDone.title')}
      subtitle={t('onboarding.personalizationDone.subtitle')}
    />
  );
}
