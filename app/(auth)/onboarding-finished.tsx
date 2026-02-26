import { OnboardingFinished as OnboardingFinishedScreen } from '@/components/screens/onboarding/onboarding-finished';
import { Heart } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function OnboardingFinished() {
  const { t } = useTranslation();

  return (
    <OnboardingFinishedScreen
      currentHref="/(auth)/onboarding-finished"
      icon={Heart}
      iconFilled={false}
      title={t('onboarding.finished.title')}
      subtitle={t('onboarding.finished.subtitle')}
      animatedNumber={10000}
      numberLabel={t('onboarding.finished.numberLabel')}
      bottomTitle={t('onboarding.finished.bottomTitle')}
      bottomSubtitle={t('onboarding.finished.bottomSubtitle')}
      buttonText={t('onboarding.finished.buttonText')}
    />
  );
}
