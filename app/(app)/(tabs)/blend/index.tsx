import { Screen } from '@/components/core/screen';
import { BlendScreen } from '@/components/screens/app-specific/blend';
import { useAsyncStorage } from '@/providers/async-storage-provider';
import { useRevenueCat } from '@/providers/revenue-cat-provider';
import { useViewedScreen } from '@/utils/posthog';
import { useRouter } from 'expo-router';

export default function Blend() {
  useViewedScreen('blend');
  const { hasActiveSubscription } = useRevenueCat();
  const { screenshotModeValue: screenshotMode } = useAsyncStorage();
  const router = useRouter();

  return (
    <Screen>
      <BlendScreen
        hasActiveSubscription={!!hasActiveSubscription || !!screenshotMode}
        onPresentPaywall={() => router.push('/(app)/(tabs)/blend/paywall')}
        onRequestReview={() => router.push('/(app)/review')}
      />
    </Screen>
  );
}
