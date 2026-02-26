import { DeleteAccountScreen } from '@/components/screens/delete-account';
import { useViewedScreen } from '@/utils/posthog';
import { useRouter } from 'expo-router';

export default function DeleteAccount() {
  const router = useRouter();
  useViewedScreen('settings-delete-account');

  return (
    <DeleteAccountScreen
      onSuccess={() => router.dismissAll()}
      onCancel={() => router.back()}
    />
  );
}
