import { BlendScreen } from '@/components/screens/app-specific/blend';
import { useRevenueCat } from '@/providers/revenue-cat-provider';
import { useViewedScreen } from '@/utils/posthog';
import { useRouter } from 'expo-router';

export default function Blend() {
  useViewedScreen('blend');
  const { hasActiveSubscription } = useRevenueCat();
  const router = useRouter();

  return (
    <BlendScreen
      hasActiveSubscription={!!hasActiveSubscription}
      onPresentPaywall={() => router.push('/(app)/(tabs)/blend/paywall')}
    />
  );
}
