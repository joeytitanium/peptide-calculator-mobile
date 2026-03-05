import { CalculatorScreen } from '@/components/screens/app-specific/calculator';
import { useAsyncStorage } from '@/providers/async-storage-provider';
import { useRevenueCat } from '@/providers/revenue-cat-provider';
import { useViewedScreen } from '@/utils/posthog';
import { useRouter } from 'expo-router';

export default function Calculator() {
  useViewedScreen('calculator');
  const { hasActiveSubscription } = useRevenueCat();
  const { screenshotModeValue: screenshotMode } = useAsyncStorage();
  const router = useRouter();

  return (
    <CalculatorScreen
      hasActiveSubscription={!!hasActiveSubscription || !!screenshotMode}
      onPresentPaywall={() => router.push('/(app)/(tabs)/calculator/paywall')}
      onRequestReview={() => router.push('/(app)/(tabs)/calculator/review')}
    />
  );
}
