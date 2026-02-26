import { SignInScreen } from '@/components/screens/sign-in';
import { useViewedScreen } from '@/utils/posthog';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ReportSignIn() {
  const router = useRouter();
  const { postId } = useLocalSearchParams<{ postId: string }>();
  useViewedScreen('feed-report-post-sign-in');

  return (
    <SignInScreen
      onSuccess={(needsUsername) => {
        if (needsUsername) {
          router.push(`/feed/report/${postId}/setup-profile`);
        } else {
          // Go back to the report confirmation screen
          router.back();
        }
      }}
    />
  );
}
