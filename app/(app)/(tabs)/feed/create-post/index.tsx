import { CreatePostScreen } from '@/components/screens/create-post';
import { useViewedScreen } from '@/utils/posthog';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function CreatePost() {
  const router = useRouter();
  const { initialImageUri } = useLocalSearchParams<{
    initialImageUri?: string;
  }>();
  useViewedScreen('feed-create-post');
  return (
    <CreatePostScreen
      onSuccess={() => router.back()}
      initialImageUri={initialImageUri}
    />
  );
}
