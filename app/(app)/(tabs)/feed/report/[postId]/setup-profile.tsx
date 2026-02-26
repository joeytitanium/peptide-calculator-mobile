import { SetupProfileScreen } from '@/components/screens/setup-profile';
import { useViewedScreen } from '@/utils/posthog';
import { useRouter } from 'expo-router';

export default function ReportSetupProfile() {
  const router = useRouter();
  useViewedScreen('feed-report-post-setup-profile');

  return (
    <SetupProfileScreen
      onSuccess={() => {
        // Go back to the report confirmation screen (2 screens back: sign-in and this one)
        router.dismiss(2);
      }}
    />
  );
}
