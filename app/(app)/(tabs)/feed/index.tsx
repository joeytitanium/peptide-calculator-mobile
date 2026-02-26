import { FeedScreen } from '@/components/screens/feed';
import { useViewedScreen } from '@/utils/posthog';
import { useRouter } from 'expo-router';

export default function Feed() {
  const router = useRouter();

  useViewedScreen('feed');

  // Uncomment for hard paywall
  // useDeterministicallyPresentPaywall({
  //   onPresentPaywall: () => {
  //     router.replace('/paywall');
  //   },
  // });

  return (
    <FeedScreen
      onCreatePost={() =>
        router.push({
          pathname: '/(app)/(tabs)/feed/create-post',
        })
      }
      onPressComments={(postId) =>
        router.push({
          pathname: '/(app)/(tabs)/feed/comments/[postId]',
          params: { postId },
        })
      }
    />
  );
}
