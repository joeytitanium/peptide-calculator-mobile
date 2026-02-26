import { HeaderCloseButton } from '@/components/core/header-button';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { ImageDropzone } from '@/components/image-dropzone';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { useCreatePost } from '@/lib/api/use-create-post';
import { useAuth } from '@/providers/auth-provider';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRouter } from 'expo-router';
import { Loader2, Send, X } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

iconWithClassName(X);
iconWithClassName(Send);
iconWithClassName(Loader2);

type CreatePostScreenProps = {
  onSuccess: () => void;
  /** Optional initial image URI to pre-fill */
  initialImageUri?: string | null;
};

export const CreatePostScreen = ({
  onSuccess,
  initialImageUri,
}: CreatePostScreenProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(
    initialImageUri ?? null
  );
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const placeholders = useMemo(
    () => [
      t('createPost.placeholders.shareResults'),
      t('createPost.placeholders.shareStory'),
      t('createPost.placeholders.whatsOnMind'),
      t('createPost.placeholders.howFeeling'),
      t('createPost.placeholders.writeCaption'),
      t('createPost.placeholders.shareCommunity'),
      t('createPost.placeholders.tellJourney'),
      t('createPost.placeholders.shareMoment'),
    ],
    [t]
  );

  // Auth state
  const { isAuthenticated } = useAuth();

  // API mutations
  const { mutate: createPost, isPending: isCreatingPost } = useCreatePost({
    onSuccess: () => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onSuccess();
    },
    onError: (error) => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(t('common.error'), error.message);
    },
  });

  const canSubmit = content.trim().length > 0 && !isCreatingPost;

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;

    if (isAuthenticated) {
      createPost({ content: content.trim(), imageUri });
      return;
    }

    // Navigate to sign-in screen
    router.push('/feed/create-post/sign-in');
  }, [canSubmit, isAuthenticated, content, imageUri, createPost, router]);

  useEffect(() => {
    if (content) return;

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [content, placeholders.length]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderCloseButton
          onPress={() => {
            router.back();
          }}
          disabled={isCreatingPost}
        />
      ),
      headerRight: () => (
        <Button
          variant="ghost"
          size="sm"
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <View className="flex-row items-center gap-2">
            <Text
              className={
                canSubmit ? 'text-lg' : 'text-lg text-muted-foreground'
              }
            >
              {t('createPost.post')}
            </Text>
            {isCreatingPost ? (
              <ActivityIndicator size={CONFIG.icon.size.sm} />
            ) : (
              <Send
                size={CONFIG.icon.size.sm}
                className={canSubmit ? 'text-primary' : 'text-muted-foreground'}
              />
            )}
          </View>
        </Button>
      ),
    });
  }, [navigation, router, canSubmit, isCreatingPost, handleSubmit, t]);

  return (
    <KeyboardAwareScrollView
      ref={scrollViewRef}
      className="flex-1 pt-2"
    >
      <TextInput
        className="w-full px-4 text-2xl font-semibold text-foreground lg:text-3xl"
        placeholder={placeholders[placeholderIndex]}
        multiline
        value={content}
        onChangeText={setContent}
        editable={!isCreatingPost}
      />
      <ImageDropzone
        className="mx-4 mt-6"
        onAddImage={setImageUri}
        initialImageUri={initialImageUri}
      />
    </KeyboardAwareScrollView>
  );
};
