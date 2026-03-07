import { PaywallV2 } from '@/components/screens/paywalls/v2';
import { handlePaywallComplete } from '@/lib/drip-notifications';
import { useRouter } from 'expo-router';

export default function BlendPaywallScreen() {
  const router = useRouter();

  return (
    <PaywallV2
      onAutoClose={() => {
        router.back();
      }}
      onClose={() => {
        router.back();
      }}
      onComplete={handlePaywallComplete}
    />
  );
}
