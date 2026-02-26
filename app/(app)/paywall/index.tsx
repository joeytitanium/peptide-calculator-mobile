import { PaywallV2 } from '@/components/paywall-v2';
import { handlePaywallComplete } from '@/lib/drip-notifications';
import { useRouter } from 'expo-router';

const AppPaywallScreen = () => {
  const router = useRouter();

  return (
    <PaywallV2
      onAutoClose={() => {
        router.dismissTo('/');
      }}
      onClose={() => {
        router.dismissTo('/');
      }}
      onComplete={handlePaywallComplete}
    />
  );
};

export default AppPaywallScreen;
