import { Avatar } from '@/components/core/avatar';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { useCreateComment } from '@/lib/api/use-create-comment';
import { Comment, useGetPost } from '@/lib/api/use-get-post';
import { formatDistanceToNow } from 'date-fns';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import {
  KeyboardStickyView,
  useReanimatedKeyboardAnimation,
} from 'react-native-keyboard-controller';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

iconWithClassName(X);

const QUICK_EMOJIS = ['❤️', '🙏', '🔥', '👏', '😢', '😍', '😂', '😮'];

type CommentsScreenProps = {
  postId: string;
  currentUserProfileImageUrl: string | null;
  onClose: () => void;
};

const CommentRow = ({ comment }: { comment: Comment }) => (
  <View className="flex-row gap-3 px-4 py-3">
    <Avatar imageUrl={comment.profileImageUrl} />
    <View className="flex-1">
      <View className="flex-row items-center gap-2">
        <Text className="font-semibold">{comment.username}</Text>
        <Text className="text-xs text-muted-foreground">
          {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
        </Text>
      </View>
      <Text className="mt-1">{comment.content}</Text>
    </View>
  </View>
);

const CommentsShell = ({
  onClose,
  title,
  children,
}: {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <View className="flex-1 bg-background">
    <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
      <View style={{ width: CONFIG.icon.size.md }} />
      <Text className="text-lg font-semibold">{title}</Text>
      <Pressable
        onPress={onClose}
        hitSlop={8}
      >
        <X
          size={CONFIG.icon.size.md}
          className="text-foreground"
        />
      </Pressable>
    </View>
    {children}
  </View>
);

const LoadingState = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  return (
    <CommentsShell onClose={onClose} title={t('comments.title')}>
      <View className="flex-1 items-center justify-center gap-2">
        <ActivityIndicator />
        <Text className="text-muted-foreground">{t('comments.loadingComments')}</Text>
      </View>
    </CommentsShell>
  );
};

const PostNotFound = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  return (
    <CommentsShell onClose={onClose} title={t('comments.title')}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-muted-foreground">{t('comments.postNotFound')}</Text>
      </View>
    </CommentsShell>
  );
};

export const CommentsScreen = ({
  postId,
  currentUserProfileImageUrl,
  onClose,
}: CommentsScreenProps) => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const { data: post, isLoading } = useGetPost(postId);
  const { mutate: createComment, isPending: isSubmitting } = useCreateComment();
  const { progress } = useReanimatedKeyboardAnimation();

  const animatedPaddingStyle = useAnimatedStyle(() => ({
    paddingBottom: interpolate(progress.value, [0, 1], [bottom, 0]),
  }));

  const handleSubmit = () => {
    const content = inputText.trim();
    if (!content || isSubmitting) return;

    Keyboard.dismiss();
    createComment(
      { postId, content },
      {
        onSuccess: () => {
          setInputText('');
        },
      }
    );
  };

  const handleEmojiPress = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  if (isLoading) {
    return <LoadingState onClose={onClose} />;
  }

  if (!post) {
    return <PostNotFound onClose={onClose} />;
  }

  const { comments } = post;

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
        <View style={{ width: CONFIG.icon.size.md }} />
        <Text className="text-lg font-semibold">{t('comments.title')}</Text>
        <Pressable
          onPress={onClose}
          hitSlop={8}
        >
          <X
            size={CONFIG.icon.size.sm}
            className="text-foreground"
          />
        </Pressable>
      </View>

      {/* Comments list */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      >
        {comments.length === 0 ? (
          <View className="items-center justify-center py-16">
            <Text className="font-medium">{t('comments.noCommentsYet')}</Text>
            <Text className="text-sm text-muted-foreground">
              {t('comments.beFirstToComment')}
            </Text>
          </View>
        ) : (
          comments.map((comment) => (
            <CommentRow
              key={comment.id}
              comment={comment}
            />
          ))
        )}
      </ScrollView>

      {/* Sticky input area */}
      <KeyboardStickyView offset={{ closed: 0, opened: 0 }}>
        <Animated.View
          className="border-t border-border bg-background"
          style={animatedPaddingStyle}
        >
          {/* Quick emojis */}
          <View className="border-b border-border px-2 py-2 gap-1 flex-row justify-between">
            {QUICK_EMOJIS.map((emoji) => (
              <Button
                variant="ghost"
                size="icon"
                key={emoji}
                onPress={() => handleEmojiPress(emoji)}
                className="rounded-full"
              >
                <Text className="text-lg">{emoji}</Text>
              </Button>
            ))}
          </View>

          {/* Input row */}
          <View className="flex-row items-center gap-2 px-4 py-3">
            <Avatar imageUrl={currentUserProfileImageUrl} />
            <Input
              className="flex-1 rounded-full bg-muted px-4 py-2 text-foreground"
              placeholder={t('comments.addComment')}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSubmit}
              returnKeyType="send"
              editable={!isSubmitting}
              multiline
            />
            {inputText.trim() && (
              <Button
                size="sm"
                variant="ghost"
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Text className="font-semibold text-primary">{t('post.post')}</Text>
                )}
              </Button>
            )}
          </View>
        </Animated.View>
      </KeyboardStickyView>
    </View>
  );
};
