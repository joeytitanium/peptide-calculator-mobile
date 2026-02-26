import { IMAGE_ASSETS } from '@/components/assets';
import { OnboardingCommunity as OnboardingCommunityScreen } from '@/components/screens/onboarding/onboarding-community';
import { Users } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function OnboardingCommunity() {
  const { t } = useTranslation();

  return (
    <OnboardingCommunityScreen
      currentHref="/(auth)/onboarding-community"
      title={t('onboarding.community.title')}
      subtitle={t('onboarding.community.subtitle')}
      buttonText={t('onboarding.community.buttonText')}
      imageSource={IMAGE_ASSETS['onboarding-community']}
      icon={Users}
    />
  );
}
