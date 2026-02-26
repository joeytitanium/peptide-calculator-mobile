import { PaywallV2 } from '@/components/paywall-v2';
import { handlePaywallComplete } from '@/lib/drip-notifications';
import { useAsyncStorage } from '@/providers/async-storage-provider';

import { useRouter } from 'expo-router';

const OnboardingPaywallScreen = () => {
  const router = useRouter();
  const { onboardingCompletedSetValue } = useAsyncStorage();

  return (
    <PaywallV2
      onAutoClose={() => {
        router.replace('/(app)/(tabs)/home');
        onboardingCompletedSetValue(true);
      }}
      onClose={() => {
        router.replace('/(app)/(tabs)/home');
        onboardingCompletedSetValue(true);
      }}
      onComplete={handlePaywallComplete}
    />
  );
};

export default OnboardingPaywallScreen;
