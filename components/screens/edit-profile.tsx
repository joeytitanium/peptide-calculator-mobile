import { HeaderCloseButton } from '@/components/core/header-button';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { ProfileImagePicker } from '@/components/profile-image-picker';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { useUpdateMe } from '@/lib/api/use-update-me';
import { useAuth } from '@/providers/auth-provider';
import { fileToBase64DataUrl } from '@/utils/file-to-base64';
import * as Haptics from 'expo-haptics';
import { useNavigation } from 'expo-router';
import { X } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

iconWithClassName(X);

type EditProfileScreenProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

export const EditProfileScreen = ({
  onSuccess,
  onCancel,
}: EditProfileScreenProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { username, profileImageUrl, setProfileImageUrl } = useAuth();
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const { mutateAsync: updateMe, isPending: isSubmitting } = useUpdateMe();

  // Use selected image or existing profile image
  const displayImageUri = selectedImageUri ?? profileImageUrl;
  const hasChanges = selectedImageUri !== null;

  const handleSubmit = useCallback(async () => {
    if (!hasChanges || isSubmitting) return;

    try {
      const base64DataUrl = await fileToBase64DataUrl(selectedImageUri!);
      const result = await updateMe({ profileImageBlob: base64DataUrl });

      if (result.profileImageUrl) {
        setProfileImageUrl(result.profileImageUrl);
      }

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onSuccess();
    } catch (error) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        t('common.error'),
        error instanceof Error ? error.message : t('profile.failedToUpdate')
      );
    }
  }, [
    hasChanges,
    isSubmitting,
    selectedImageUri,
    updateMe,
    setProfileImageUrl,
    onSuccess,
    t,
  ]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderCloseButton
          onPress={onCancel}
          disabled={isSubmitting}
        />
      ),
      headerRight: () => (
        <Button
          variant="ghost"
          size="sm"
          onPress={() => {
            void handleSubmit();
          }}
          disabled={!hasChanges || isSubmitting}
        >
          <View className="flex-row items-center gap-2">
            <Text
              className={
                hasChanges && !isSubmitting
                  ? 'text-lg'
                  : 'text-lg text-muted-foreground'
              }
            >
              {t('common.save')}
            </Text>
            {isSubmitting && <ActivityIndicator size={CONFIG.icon.size.sm} />}
          </View>
        </Button>
      ),
    });
  }, [navigation, onCancel, isSubmitting, hasChanges, handleSubmit, t]);

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-1 px-6 pt-4">
        <View className="items-center">
          <ProfileImagePicker
            imageUri={displayImageUri}
            onImageSelected={setSelectedImageUri}
            disabled={isSubmitting}
          />
          <Text className="mt-3 text-sm text-muted-foreground">
            {t('profile.tapToChangePhoto')}
          </Text>
        </View>

        <View className="mt-8">
          <Text className="text-sm text-muted-foreground mb-1">
            {t('profile.username')}
          </Text>
          <Text className="text-lg font-medium">
            {username ? `@${username}` : t('profile.notSet')}
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
