import { AccountSettingsScreen } from '@/components/screens/account-settings';
import { useViewedScreen } from '@/utils/posthog';
import { useRouter } from 'expo-router';

export default function Account() {
  const router = useRouter();
  useViewedScreen('settings-account');

  return (
    <AccountSettingsScreen
      onEditProfile={() => router.push('/settings/edit-profile')}
      onDeleteAccount={() => router.push('/settings/delete-account')}
      onSignOut={() => router.back()}
    />
  );
}
