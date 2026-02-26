import { HeaderCloseButton } from '@/components/core/header-button';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { useDeleteAccount } from '@/lib/api/use-delete-account';
import * as Haptics from 'expo-haptics';
import { useNavigation } from 'expo-router';
import { X } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

iconWithClassName(X);

type DeleteAccountScreenProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

export const DeleteAccountScreen = ({
  onSuccess,
  onCancel,
}: DeleteAccountScreenProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [confirmationInput, setConfirmationInput] = useState('');
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

  const confirmationText = t('account.deleteAccountConfirmText');
  const isConfirmed =
    confirmationInput.toLowerCase() === confirmationText.toLowerCase();

  const handleDelete = useCallback(() => {
    if (isDeleting) return;

    if (!isConfirmed) {
      Alert.alert(t('common.error'), t('account.deleteAccountConfirmError'));
      return;
    }

    deleteAccount(undefined, {
      onSuccess: () => {
        void Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
        Alert.alert(
          t('account.deleteAccountScheduledTitle'),
          t('account.deleteAccountScheduledMessage'),
          [{ text: t('common.ok'), onPress: onSuccess }]
        );
      },
      onError: (error) => {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert(t('common.error'), error.message);
      },
    });
  }, [isConfirmed, isDeleting, deleteAccount, onSuccess, t]);

  // Set up navigation header
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderCloseButton
          onPress={onCancel}
          disabled={isDeleting}
        />
      ),
      headerRight: () => (
        <Button
          variant="ghost"
          size="sm"
          onPress={handleDelete}
        >
          <View className="flex-row items-center gap-2">
            <Text className="text-lg text-destructive">{t('common.delete')}</Text>
            {isDeleting && <ActivityIndicator size={CONFIG.icon.size.sm} />}
          </View>
        </Button>
      ),
    });
  }, [navigation, onCancel, isDeleting, handleDelete]);

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-1 px-6 pt-4">
        <Text className="text-2xl font-semibold tracking-tight text-destructive">
          {t('account.deleteAccountTitle')}
        </Text>
        <Text className="mt-4 text-base text-muted-foreground">
          {t('account.deleteAccountWarning')}
        </Text>

        <View className="mt-8">
          <Text className="text-base font-medium mb-2">
            {t('account.deleteAccountConfirmPrompt', { confirmText: confirmationText })}
          </Text>
          <Input
            placeholder={confirmationText}
            value={confirmationInput}
            onChangeText={setConfirmationInput}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isDeleting}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
