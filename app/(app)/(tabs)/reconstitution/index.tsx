import { Screen } from '@/components/core/screen';
import { ReconstitutionScreen } from '@/components/screens/app-specific/reconstitution';
import { useAsyncStorage } from '@/providers/async-storage-provider';
import { useRevenueCat } from '@/providers/revenue-cat-provider';
import { useViewedScreen } from '@/utils/posthog';
import { useRouter } from 'expo-router';

export default function Reconstitution() {
  useViewedScreen('reconstitution');
  const { hasActiveSubscription } = useRevenueCat();
  const { screenshotModeValue: screenshotMode } = useAsyncStorage();
  const router = useRouter();

  return (
    <Screen>
      <ReconstitutionScreen
        hasActiveSubscription={!!hasActiveSubscription || !!screenshotMode}
        onPresentPaywall={() =>
          router.push('/(app)/(tabs)/reconstitution/paywall')
        }
        onRequestReview={() =>
          router.push('/(app)/review')
        }
      />
    </Screen>
  );
}
