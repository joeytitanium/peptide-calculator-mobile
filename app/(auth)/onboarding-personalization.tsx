import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { OnboardingPersonalization as OnboardingPersonalizationScreen } from '@/components/screens/onboarding/onboarding-personalization';
import { useViewedScreen } from '@/utils/posthog';
import {
  Calendar,
  CheckCircle,
  Settings,
  Sparkles,
  User,
} from 'lucide-react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

iconWithClassName(Calendar);
iconWithClassName(CheckCircle);
iconWithClassName(Settings);
iconWithClassName(Sparkles);
iconWithClassName(User);

export default function OnboardingPersonalization() {
  const { t } = useTranslation();
  useViewedScreen('onboarding-personalization');

  const steps = useMemo(
    () => [
      {
        title: t('onboarding.personalization.steps.profile.title'),
        description: t('onboarding.personalization.steps.profile.description'),
        icon: User,
      },
      {
        title: t('onboarding.personalization.steps.calendar.title'),
        description: t('onboarding.personalization.steps.calendar.description'),
        icon: Calendar,
      },
      {
        title: t('onboarding.personalization.steps.insights.title'),
        description: t('onboarding.personalization.steps.insights.description'),
        icon: Sparkles,
      },
      {
        title: t('onboarding.personalization.steps.preferences.title'),
        description: t('onboarding.personalization.steps.preferences.description'),
        icon: Settings,
      },
      {
        title: t('onboarding.personalization.steps.ready.title'),
        description: t('onboarding.personalization.steps.ready.description'),
        icon: CheckCircle,
      },
    ],
    [t]
  );

  return (
    <OnboardingPersonalizationScreen
      steps={steps}
      currentHref="/(auth)/onboarding-personalization"
      title={t('onboarding.personalization.title')}
      subtitle={t('onboarding.personalization.subtitle')}
    />
  );
}
