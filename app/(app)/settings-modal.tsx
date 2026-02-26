import { HeaderCloseButton } from '@/components/core/header-button';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { SettingsScreen } from '@/components/screens/settings';
import { Stack, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';

iconWithClassName(X);

const SettingsModal = () => {
  const router = useRouter();

  const handleNavigateToAccount = () => {
    // TODO: Navigate to account settings when needed
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => <HeaderCloseButton onPress={() => router.back()} />,
        }}
      />
      <SettingsScreen
        onNavigateToAccount={handleNavigateToAccount}
        onNavigateToLocale={() => router.push('/settings/locale')}
        accountSupportDisabled
        onPresentPaywall={() => router.push('/paywall')}
      />
    </>
  );
};

export default SettingsModal;
