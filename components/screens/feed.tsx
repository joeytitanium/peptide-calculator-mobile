import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { PostCard } from '@/components/post-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { VoteValue } from '@/lib/api/types';
import { useDeletePost } from '@/lib/api/use-delete-post';
import { Post, useGetPosts, Vote } from '@/lib/api/use-get-posts';
import { useDeleteVote, useVote } from '@/lib/api/use-vote';
import { useAuth } from '@/providers/auth-provider';
import { useNavigation, useRouter } from 'expo-router';
import { Plus, RefreshCw } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  useWindowDimensions,
  View,
} from 'react-native';

iconWithClassName(Plus);
iconWithClassName(RefreshCw);

/** Find the current user's vote from the votes array */
const findUserVote = (
  votes: Vote[],
  username: string | null
): VoteValue | null => {
  if (!username) return null;
  const userVote = votes.find((v) => v.username === username);
  return userVote?.vote ?? null;
};

type FeedScreenProps = {
  onCreatePost: () => void;
  onPressComments: (postId: string) => void;
};

const PostSkeleton = () => {
  const { width } = useWindowDimensions();

  return (
    <View className="bg-background">
      {/* Username skeleton */}
      <View className="px-4 py-3">
        <Skeleton className="h-4 w-24" />
      </View>

      {/* Image skeleton */}
      <Skeleton style={{ width, height: width }} />

      {/* Action buttons skeleton */}
      <View className="flex-row items-center gap-4 px-4 py-3">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-6 w-8" />
      </View>

      {/* Content skeleton */}
      <View className="gap-2 px-4 pb-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </View>
    </View>
  );
};

const LoadingState = () => (
  <View className="flex-1">
    <PostSkeleton />
    <View className="h-4" />
    <PostSkeleton />
  </View>
);

const EmptyState = () => {
  const { t } = useTranslation();
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Text className="text-center text-lg font-semibold">{t('feed.noPostsYet')}</Text>
      <Text className="mt-2 text-center text-muted-foreground">
        {t('feed.beFirstToShare')}
      </Text>
    </View>
  );
};

const ErrorState = ({ onRetry }: { onRetry: () => void }) => {
  const { t } = useTranslation();
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Text className="text-center text-lg font-semibold">
        {t('feed.couldntLoadPosts')}
      </Text>
      <Text className="mt-2 text-center text-muted-foreground">
        {t('feed.somethingWentWrong')}
      </Text>
      <Button
        className="mt-6 flex-row items-center gap-2"
        onPress={onRetry}
      >
        <RefreshCw
          size={CONFIG.icon.size.sm}
          className="text-primary-foreground"
        />
        <Text className="font-semibold text-primary-foreground">{t('feed.tryAgain')}</Text>
      </Button>
    </View>
  );
};

export const FeedScreen = ({
  onCreatePost,
  onPressComments,
}: FeedScreenProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();
  const { username, isAuthenticated } = useAuth();
  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPosts();
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [votingPostId, setVotingPostId] = useState<string | null>(null);

  // Flatten all pages into a single posts array
  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.posts) ?? [],
    [data?.pages]
  );

  const { mutate: deletePost } = useDeletePost({
    onMutate: (postId) => {
      setDeletingPostId(postId);
    },
    onSettled: () => {
      setDeletingPostId(null);
    },
  });

  const { mutate: vote } = useVote();
  const { mutate: deleteVote } = useDeleteVote();

  const handleDeletePost = useCallback(
    (postId: string) => {
      Alert.alert(t('feed.deletePostTitle'), t('feed.deletePostMessage'), [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            deletePost(postId);
          },
        },
      ]);
    },
    [deletePost, t]
  );

  const handleReportPost = useCallback(
    (postId: string) => {
      router.push(`/feed/report/${postId}`);
    },
    [router]
  );

  const handleComments = useCallback(
    (postId: string) => {
      // Require authentication to view/add comments
      if (!isAuthenticated) {
        router.push('/feed/sign-in');
        return;
      }
      onPressComments(postId);
    },
    [isAuthenticated, router, onPressComments]
  );

  const handleVote = useCallback(
    (post: Post, voteType: VoteValue) => {
      // Require authentication to vote
      if (!isAuthenticated) {
        router.push('/feed/sign-in');
        return;
      }

      const currentVote = findUserVote(post.votes, username);

      setVotingPostId(post.id);

      // If user already has this vote, remove it (toggle off)
      if (currentVote === voteType) {
        deleteVote(
          { postId: post.id },
          { onSettled: () => setVotingPostId(null) }
        );
      } else {
        // Otherwise, cast the vote (this will upsert)
        vote(
          { postId: post.id, vote: voteType },
          { onSettled: () => setVotingPostId(null) }
        );
      }
    },
    [isAuthenticated, router, username, vote, deleteVote]
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          variant="ghost"
          size="icon"
          onPress={onCreatePost}
        >
          <Plus
            size={CONFIG.icon.size.md}
            className="text-primary mb-1"
          />
        </Button>
      ),
    });
  }, [navigation, onCreatePost]);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard
        post={item}
        currentUsername={username}
        isDeleting={deletingPostId === item.id}
        isVoting={votingPostId === item.id}
        maxComments={2}
        onPressUpvote={() => handleVote(item, 'positive')}
        onPressDownvote={() => handleVote(item, 'negative')}
        onPressComments={() => handleComments(item.id)}
        onPressDelete={() => handleDeletePost(item.id)}
        onPressReport={() => handleReportPost(item.id)}
      />
    ),
    [
      username,
      deletingPostId,
      votingPostId,
      handleComments,
      handleDeletePost,
      handleReportPost,
      handleVote,
    ]
  );

  const keyExtractor = useCallback((item: Post) => item.id, []);

  const ItemSeparator = useCallback(() => <View className="h-[34px] " />, []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const ListFooterComponent = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }, [isFetchingNextPage]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <ErrorState
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (posts.length === 0) {
    return <EmptyState />;
  }

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={ItemSeparator}
      ListFooterComponent={ListFooterComponent}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => {
            void refetch();
          }}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
};
