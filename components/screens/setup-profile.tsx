import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { ProfileImagePicker } from '@/components/profile-image-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { useCheckUsername } from '@/lib/api/use-check-username';
import { useUpdateMe } from '@/lib/api/use-update-me';
import {
  isValidUsername,
  sanitizeUsername,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from '@/lib/username';
import { useAuth } from '@/providers/auth-provider';
import { fileToBase64DataUrl } from '@/utils/file-to-base64';
import { useNavigation } from 'expo-router';
import { Check, Loader2, X } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

iconWithClassName(Loader2);
iconWithClassName(Check);
iconWithClassName(X);

export const SetupProfileScreen = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();
  const { setUsername, setProfileImageUrl } = useAuth();
  const [usernameInput, setUsernameInput] = useState('');
  const [debouncedUsername, setDebouncedUsername] = useState('');
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const navigation = useNavigation();

  const isValidFormat = isValidUsername(usernameInput);

  // Debounce username for API check
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(usernameInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [usernameInput]);

  const { data: checkResult, isFetching } = useCheckUsername(debouncedUsername);

  const { mutateAsync: updateMe, isPending: isSubmitting } = useUpdateMe();

  const isAvailable = checkResult?.isAvailable ?? false;
  const isStillChecking =
    isFetching || (isValidFormat && debouncedUsername !== usernameInput);
  const canSubmit =
    isValidFormat && isAvailable && !isStillChecking && !isSubmitting;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) {
      if (!isValidFormat) {
        Alert.alert(
          t('common.error'),
          t('setupProfile.usernameErrorInstructions')
        );
      } else if (!isAvailable) {
        Alert.alert(t('common.error'), t('setupProfile.usernameTaken'));
      }
      return;
    }

    try {
      // Build update payload
      const payload: { username: string; profileImageBlob?: string } = {
        username: usernameInput,
      };

      if (profileImageUri) {
        payload.profileImageBlob = await fileToBase64DataUrl(profileImageUri);
      }

      // Update profile in single API call
      const result = await updateMe(payload);

      if (result.username) {
        setUsername(result.username);
      }
      if (result.profileImageUrl) {
        setProfileImageUrl(result.profileImageUrl);
      }

      onSuccess();
    } catch (error) {
      Alert.alert(
        t('common.error'),
        error instanceof Error
          ? error.message
          : t('setupProfile.failedToUpdate')
      );
    }
  }, [
    canSubmit,
    isValidFormat,
    isAvailable,
    usernameInput,
    profileImageUri,
    updateMe,
    setUsername,
    setProfileImageUrl,
    onSuccess,
    t,
  ]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          variant="ghost"
          size="sm"
          onPress={() => {
            void handleSubmit();
          }}
          disabled={!canSubmit}
        >
          <View className="flex-row items-center gap-2">
            <Text
              className={
                canSubmit ? 'text-xl' : 'text-xl text-muted-foreground'
              }
            >
              {t('setupProfile.next')}
            </Text>
            {isSubmitting && <ActivityIndicator size={CONFIG.icon.size.sm} />}
          </View>
        </Button>
      ),
    });
  }, [navigation, isSubmitting, canSubmit, handleSubmit, t]);

  const getStatusMessage = () => {
    if (usernameInput.length === 0) return null;
    if (usernameInput.length < USERNAME_MIN_LENGTH)
      return t('setupProfile.usernameMinLength');
    if (usernameInput.length > USERNAME_MAX_LENGTH)
      return t('setupProfile.usernameMaxLength');
    if (!isValidFormat) return t('setupProfile.onlyLettersNumbersUnderscores');
    if (isFetching || debouncedUsername !== usernameInput)
      return t('setupProfile.checking');
    if (!isAvailable) return t('setupProfile.usernameIsTaken');
    return t('setupProfile.usernameIsAvailable');
  };

  const getStatusColor = () => {
    if (
      usernameInput.length < 3 ||
      isFetching ||
      debouncedUsername !== usernameInput
    ) {
      return 'text-muted-foreground';
    }
    return isAvailable ? 'text-green-500' : 'text-red-500';
  };

  const showStatusIcon =
    isValidFormat && debouncedUsername === usernameInput && !isFetching;

  return (
    <KeyboardAwareScrollView className="bg-background">
      <View className="flex-1 px-6 pt-2">
        <Text className="text-2xl font-semibold tracking-tight">
          {t('setupProfile.title')}
        </Text>
        <Text className="mt-1 text-base text-muted-foreground leading-tight tracking-tight">
          {t('setupProfile.subtitle')}
        </Text>

        <View className="mt-6 items-center">
          <ProfileImagePicker
            imageUri={profileImageUri}
            onImageSelected={setProfileImageUri}
            disabled={isSubmitting}
          />
          <Text className="mt-2 text-sm text-muted-foreground">
            {t('setupProfile.addPhoto')}
          </Text>
        </View>

        <View className="mt-6">
          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <Input
                placeholder={t('setupProfile.placeholder')}
                value={usernameInput}
                onChangeText={(text) => {
                  setUsernameInput(sanitizeUsername(text));
                }}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
                editable={!isSubmitting}
              />
            </View>
            {isValidFormat &&
              (isFetching || debouncedUsername !== usernameInput) && (
                <ActivityIndicator size={CONFIG.icon.size.sm} />
              )}
            {showStatusIcon && isAvailable && (
              <Check
                size={20}
                className="text-green-500"
              />
            )}
            {showStatusIcon && !isAvailable && (
              <X
                size={20}
                className="text-red-500"
              />
            )}
          </View>
          <Text className={`mt-2 text-sm ${getStatusColor()}`}>
            {getStatusMessage() ?? t('setupProfile.usernameInstructions')}
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
