import { ReportPostScreen } from '@/components/screens/report-post';
import { useViewedScreen } from '@/utils/posthog';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ReportPost() {
  const router = useRouter();
  const { postId } = useLocalSearchParams<{ postId: string }>();

  useViewedScreen('feed-report-post');

  return (
    <ReportPostScreen
      postId={postId}
      onSuccess={() => router.back()}
      onCancel={() => router.back()}
      onNavigateToSignIn={() =>
        router.replace(`/feed/report/${postId}/sign-in`)
      }
    />
  );
}
