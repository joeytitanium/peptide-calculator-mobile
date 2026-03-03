import { CalculatorScreen } from '@/components/screens/app-specific/calculator';
import { useRevenueCat } from '@/providers/revenue-cat-provider';
import { useViewedScreen } from '@/utils/posthog';
import { useRouter } from 'expo-router';

export default function Calculator() {
  useViewedScreen('calculator');
  const { hasActiveSubscription } = useRevenueCat();
  const router = useRouter();

  return (
    <CalculatorScreen
      hasActiveSubscription={!!hasActiveSubscription}
      onPresentPaywall={() => router.push('/(app)/(tabs)/calculator/paywall')}
    />
  );
}
