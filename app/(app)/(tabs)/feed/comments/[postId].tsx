import { CommentsScreen } from '@/components/screens/comments';
import { useAuth } from '@/providers/auth-provider';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Comments() {
  const router = useRouter();
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const { profileImageUrl } = useAuth();

  return (
    <CommentsScreen
      postId={postId}
      currentUserProfileImageUrl={profileImageUrl}
      onClose={() => router.back()}
    />
  );
}
