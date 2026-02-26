import { SetupProfileScreen } from '@/components/screens/setup-profile';
import { useViewedScreen } from '@/utils/posthog';
import { useRouter } from 'expo-router';

export default function SetupProfile() {
  const router = useRouter();
  useViewedScreen('feed-create-post-setup-profile');
  return <SetupProfileScreen onSuccess={() => router.dismissAll()} />;
}
