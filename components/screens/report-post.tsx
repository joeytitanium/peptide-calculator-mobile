import { HeaderCloseButton } from '@/components/core/header-button';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { useReportPost } from '@/lib/api/use-report-post';
import { useAuth } from '@/providers/auth-provider';
import * as Haptics from 'expo-haptics';
import { useNavigation } from 'expo-router';
import { X } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

iconWithClassName(X);

const MAX_REASON_LENGTH = 500;

type ReportPostScreenProps = {
  postId: string;
  onSuccess: () => void;
  onCancel: () => void;
  onNavigateToSignIn: () => void;
};

export const ReportPostScreen = ({
  postId,
  onSuccess,
  onCancel,
  onNavigateToSignIn,
}: ReportPostScreenProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { isAuthenticated, isLoading } = useAuth();
  const [reason, setReason] = useState('');

  const { mutate: reportPost, isPending: isSubmitting } = useReportPost({
    onSuccess: () => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(t('reportPost.successTitle'), t('reportPost.successMessage'), [
        {
          text: t('common.ok'),
          onPress: onSuccess,
        },
      ]);
    },
    onError: (error) => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(t('common.error'), error.message);
    },
  });

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      onNavigateToSignIn();
    }
  }, [isAuthenticated, isLoading, onNavigateToSignIn]);

  const handleReport = useCallback(() => {
    if (isSubmitting) return;

    if (reason.trim().length === 0) {
      Alert.alert(t('common.error'), t('reportPost.errorNoReason'));
      return;
    }

    reportPost({ postId, reason: reason.trim() });
  }, [isSubmitting, reason, postId, reportPost, t]);

  // Set up navigation header
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
            void handleReport();
          }}
        >
          <View className="flex-row items-center gap-2">
            <Text className="text-lg">{t('reportPost.submit')}</Text>
            {isSubmitting && <ActivityIndicator size={CONFIG.icon.size.sm} />}
          </View>
        </Button>
      ),
    });
  }, [navigation, onCancel, isSubmitting, handleReport, t]);

  // Show loading while checking auth
  if (isLoading || !isAuthenticated) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-1 px-6 pt-2">
        <Text className="text-base text-muted-foreground">
          {t('reportPost.description')}
        </Text>

        <View className="mt-6">
          <Input
            className="min-h-[120px]"
            placeholder={t('reportPost.placeholder')}
            multiline
            textAlignVertical="top"
            value={reason}
            onChangeText={(text) => setReason(text.slice(0, MAX_REASON_LENGTH))}
            maxLength={MAX_REASON_LENGTH}
            editable={!isSubmitting}
          />
          <Text className="mt-2 text-right text-sm text-muted-foreground">
            {reason.length}/{MAX_REASON_LENGTH}
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
