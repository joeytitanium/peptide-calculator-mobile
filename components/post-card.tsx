import { CONFIG } from '@/config';
import { VoteValue } from '@/lib/api/types';
import { Post, Vote } from '@/lib/api/use-get-posts';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import {
  EllipsisVertical,
  MessageCircle,
  MinusCircle,
  PlusCircle,
} from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native';
import { Avatar } from './core/avatar';
import { ContextMenu, ContextMenuAction } from './core/context-menu';
import { iconWithClassName } from './icons/iconWithClassName';
import { ImageZoomModal } from './image-zoom-modal';
import { Button } from './ui/button';
import { Text } from './ui/text';

iconWithClassName(PlusCircle);
iconWithClassName(MinusCircle);
iconWithClassName(MessageCircle);
iconWithClassName(EllipsisVertical);

/** Find the current user's vote from the votes array */
const findUserVote = (
  votes: Vote[],
  username: string | null
): VoteValue | null => {
  if (!username) return null;
  const userVote = votes.find((v) => v.username === username);
  return userVote?.vote ?? null;
};

type PostCardProps = {
  post: Post;
  currentUsername: string | null;
  isDeleting?: boolean;
  isVoting?: boolean;
  onPressComments: () => void;
  onPressUpvote: () => void;
  onPressDownvote: () => void;
  onPressDelete: () => void;
  onPressReport: () => void;
  /** Maximum number of comments to show. If undefined, shows all comments. */
  maxComments?: number;
};

const ActionButton = ({
  icon,
  count,
  onPress,
  isActive,
  disabled,
}: {
  icon: React.ReactNode;
  count: number;
  onPress: () => void;
  isActive?: boolean;
  disabled?: boolean;
}) => {
  return (
    <Button
      size="sm"
      variant={isActive ? 'secondary' : 'ghost'}
      className="flex-row items-center gap-1 px-2"
      onPress={onPress}
      disabled={disabled}
    >
      {icon}
      <Text className="font-semibold text-md">{count}</Text>
    </Button>
  );
};

export const PostCard = ({
  post,
  currentUsername,
  isDeleting = false,
  isVoting = false,
  onPressComments,
  onPressUpvote,
  onPressDownvote,
  onPressDelete,
  onPressReport,
  maxComments,
}: PostCardProps) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const [isZoomModalVisible, setIsZoomModalVisible] = useState(false);
  const isImagePost = !!post.imageUrl;
  const isAuthor = currentUsername === post.authorUsername;

  const userVote = findUserVote(post.votes, currentUsername);
  const hasUpvoted = userVote === 'positive';
  const hasDownvoted = userVote === 'negative';

  const upvoteCount = post.votes.filter((v) => v.vote === 'positive').length;
  const downvoteCount = post.votes.filter((v) => v.vote === 'negative').length;
  const commentCount = post.comments.length;
  const displayedComments =
    maxComments !== undefined
      ? post.comments.slice(0, maxComments)
      : post.comments;
  const hasMoreComments =
    maxComments !== undefined && post.comments.length > maxComments;

  const contextMenuActions: ContextMenuAction[] = isAuthor
    ? [
        {
          title: t('post.delete'),
          systemIcon: 'trash',
          onPress: onPressDelete,
        },
      ]
    : [
        {
          title: t('post.report'),
          systemIcon: 'flag',
          onPress: onPressReport,
        },
      ];

  return (
    <View style={{ opacity: isDeleting ? 0.5 : 1 }}>
      {/* Deleting overlay */}
      {isDeleting && (
        <View className="absolute inset-0 z-10 items-center justify-center bg-background/50">
          <ActivityIndicator size="large" />
        </View>
      )}

      <View className="gap-1">
        {/* Username header */}
        <View className="px-2 flex-row items-center gap-2">
          <Avatar imageUrl={post.authorProfileImageUrl} />
          <Text className="font-semibold">{post.authorUsername}</Text>
        </View>

        {/* Post content */}
        {post.content && (
          <View className="px-2">
            <Text className="text-base ">{post.content}</Text>
          </View>
        )}
      </View>

      {/* Post image */}
      {post.imageUrl && (
        <Pressable
          className="mt-2"
          onPress={() => {
            void Haptics.selectionAsync();
            setIsZoomModalVisible(true);
          }}
        >
          <Image
            source={{ uri: post.imageUrl }}
            style={{ width, height: width }}
            contentFit="cover"
          />
        </Pressable>
      )}

      {/* Action buttons */}
      <View className="flex-row items-center gap-1 px-2 py-1">
        {/* Upvote button */}
        {isImagePost && (
          <ActionButton
            icon={
              <PlusCircle
                size={CONFIG.icon.size.sm}
                className={clsx(
                  hasUpvoted ? 'text-green-500' : 'text-muted-foreground'
                )}
                strokeWidth={1.5}
              />
            }
            onPress={onPressUpvote}
            count={upvoteCount}
            isActive={hasUpvoted}
            disabled={isVoting}
          />
        )}

        {/* Downvote button */}
        {isImagePost && (
          <ActionButton
            icon={
              <MinusCircle
                size={CONFIG.icon.size.sm}
                className={clsx(
                  hasDownvoted ? 'text-red-500' : 'text-muted-foreground'
                )}
                strokeWidth={1.5}
              />
            }
            onPress={onPressDownvote}
            count={downvoteCount}
            isActive={hasDownvoted}
            disabled={isVoting}
          />
        )}

        {/* Comments button */}
        <ActionButton
          icon={
            <MessageCircle
              size={CONFIG.icon.size.sm}
              strokeWidth={1.5}
              className="text-muted-foreground"
            />
          }
          onPress={onPressComments}
          count={commentCount}
        />

        {/* Spacer */}
        <View className="flex-1" />

        {/* More options menu */}
        <ContextMenu actions={contextMenuActions}>
          <Button
            size="sm"
            variant="ghost"
            className="px-2"
          >
            <EllipsisVertical
              size={CONFIG.icon.size.sm}
              strokeWidth={1.5}
              className="text-muted-foreground"
            />
          </Button>
        </ContextMenu>
      </View>

      <View className="gap-1 px-4">
        {/* Comments */}
        {displayedComments.length > 0 && (
          <View className="gap-1">
            {displayedComments.map((comment) => (
              <Text key={comment.id}>
                <Text className="font-semibold">{comment.username}</Text>{' '}
                {comment.content}
              </Text>
            ))}
          </View>
        )}

        {/* View more comments */}
        {hasMoreComments && (
          <Pressable onPress={onPressComments}>
            <Text className="text-muted-foreground">
              {t('feed.viewAllComments', { count: commentCount })}
            </Text>
          </Pressable>
        )}

        {/* Post timestamp */}
        <Text className="text-muted-foreground text-xs ">
          {formatDistanceToNow(post.createdAt, { addSuffix: true })}
        </Text>
      </View>

      {/* Image Zoom Modal */}
      <ImageZoomModal
        visible={isZoomModalVisible}
        uri={post.imageUrl ?? undefined}
        onClose={() => setIsZoomModalVisible(false)}
      />
    </View>
  );
};
