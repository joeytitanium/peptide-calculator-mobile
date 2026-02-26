import { PaywallV2 } from '@/components/paywall-v2';
import { handlePaywallComplete } from '@/lib/drip-notifications';
import { useRouter } from 'expo-router';

export default function LogPaywallScreen() {
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
