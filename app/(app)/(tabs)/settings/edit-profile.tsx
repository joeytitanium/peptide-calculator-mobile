import { EditProfileScreen } from '@/components/screens/edit-profile';
import { useViewedScreen } from '@/utils/posthog';
import { useRouter } from 'expo-router';

export default function EditProfile() {
  const router = useRouter();
  useViewedScreen('settings-edit-profile');

  return (
    <EditProfileScreen
      onSuccess={() => router.back()}
      onCancel={() => router.back()}
    />
  );
}

