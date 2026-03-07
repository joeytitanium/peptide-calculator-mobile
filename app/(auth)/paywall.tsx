import { PaywallV2 } from '@/components/screens/paywalls/v2';
import { handlePaywallComplete } from '@/lib/drip-notifications';
import { useAsyncStorage } from '@/providers/async-storage-provider';

import { useRouter } from 'expo-router';
import { PACKAGE_TYPE } from 'react-native-purchases';

const OnboardingPaywallScreen = () => {
  const router = useRouter();
  const { onboardingCompletedSetValue } = useAsyncStorage();

  return (
    <PaywallV2
      excludePackageTypes={[PACKAGE_TYPE.CUSTOM]}
      onAutoClose={() => {
        router.replace('/(app)/(tabs)/calculator');
        onboardingCompletedSetValue(true);
      }}
      onClose={() => {
        router.replace('/(auth)/paywall-fallback');
      }}
      onComplete={handlePaywallComplete}
    />
  );
};

export default OnboardingPaywallScreen;
