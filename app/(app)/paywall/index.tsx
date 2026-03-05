import { PaywallV2 } from '@/components/paywall-v2';
import { handlePaywallComplete } from '@/lib/drip-notifications';
import { useRouter } from 'expo-router';
import { PACKAGE_TYPE } from 'react-native-purchases';

const AppPaywallScreen = () => {
  const router = useRouter();

  return (
    <PaywallV2
      excludePackageTypes={[PACKAGE_TYPE.CUSTOM]}
      onAutoClose={() => {
        router.back();
      }}
      onClose={() => {
        router.back();
      }}
      onComplete={handlePaywallComplete}
    />
  );
};

export default AppPaywallScreen;
