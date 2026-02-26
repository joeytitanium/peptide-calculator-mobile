import { SettingsScreen } from '@/components/screens/settings';
import { useViewedScreen } from '@/utils/posthog';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();
  useViewedScreen('settings');

  return (
    <SettingsScreen
      onNavigateToAccount={() => router.push('/settings/account')}
      onNavigateToLocale={() => router.push('/settings/locale')}
      onPresentPaywall={() => router.push('/paywall')}
    />
  );
}
