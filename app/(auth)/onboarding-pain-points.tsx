import { OnboardingPainPoints as OnboardingPainPointsScreen } from '@/components/screens/onboarding/onboarding-pain-points';
import { Frown } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function OnboardingPainPoints() {
  const { t } = useTranslation();

  return (
    <OnboardingPainPointsScreen
      currentHref="/(auth)/onboarding-pain-points"
      title={t('onboarding.painPoints.title')}
      subtitle={t('onboarding.painPoints.subtitle')}
      buttonText={t('onboarding.painPoints.buttonText')}
      icon={Frown}
      iconBgColor="red"
    />
  );
}
