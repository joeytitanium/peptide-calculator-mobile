import { ReconstitutionScreen } from '@/components/screens/app-specific/reconstitution';
import { useRevenueCat } from '@/providers/revenue-cat-provider';
import { useViewedScreen } from '@/utils/posthog';
import { useRouter } from 'expo-router';

export default function Reconstitution() {
  useViewedScreen('reconstitution');
  const { hasActiveSubscription } = useRevenueCat();
  const router = useRouter();

  return (
    <ReconstitutionScreen
      hasActiveSubscription={!!hasActiveSubscription}
      onPresentPaywall={() =>
        router.push('/(app)/(tabs)/reconstitution/paywall')
      }
    />
  );
}
