import { OnboardingComparison as OnboardingComparisonScreen } from '@/components/screens/onboarding/onboarding-comparison';
import { useTranslation } from 'react-i18next';

export default function OnboardingComparison() {
  const { t } = useTranslation();

  return (
    <OnboardingComparisonScreen
      currentHref="/(auth)/onboarding-comparison"
      title={t('onboarding.comparison.title')}
      subtitle={t('onboarding.comparison.subtitle')}
      comparisonData={[
        {
          label: t('onboarding.comparison.withoutTracking'),
          percentage: 23,
          color: 'red',
        },
        {
          label: t('onboarding.comparison.withApp'),
          percentage: 87,
          color: 'green',
        },
      ]}
      buttonText={t('onboarding.comparison.buttonText')}
    />
  );
}
