import { PaywallFallbackScreen } from '@/components/screens/app-specific/paywall-fallback';
import { handlePaywallComplete } from '@/lib/drip-notifications';
import { useAsyncStorage } from '@/providers/async-storage-provider';
import { useRouter } from 'expo-router';

export default function PaywallFallback() {
  const router = useRouter();
  const { onboardingCompletedSetValue } = useAsyncStorage();

  return (
    <PaywallFallbackScreen
      onAutoClose={() => {
        router.replace('/(app)/(tabs)/calculator');
        onboardingCompletedSetValue(true);
      }}
      onClose={() => {
        router.replace('/(app)/(tabs)/calculator');
        onboardingCompletedSetValue(true);
      }}
      onComplete={handlePaywallComplete}
    />
  );
}
