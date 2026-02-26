import { OnboardingBenefits as OnboardingBenefitsScreen } from '@/components/screens/onboarding/onboarding-benefits';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function OnboardingBenefits() {
  const { t } = useTranslation();

  return (
    <OnboardingBenefitsScreen
      currentHref="/(auth)/onboarding-benefits"
      title={t('onboarding.benefits.title')}
      benefits={[
        t('onboarding.benefits.benefit1'),
        t('onboarding.benefits.benefit2'),
        t('onboarding.benefits.benefit3'),
        t('onboarding.benefits.benefit4'),
      ]}
      buttonText={t('onboarding.benefits.buttonText')}
      icon={Check}
      iconBgColor="green"
    />
  );
}
