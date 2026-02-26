import { ConfirmScreen } from '@/components/screens/confirm';
import { useAnalyzeWaterPhoto } from '@/hooks/app-specific/use-analyze-water-photo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

export default function ConfirmPhoto() {
  const router = useRouter();
  const { t } = useTranslation();
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const { analyzePhoto } = useAnalyzeWaterPhoto();

  if (!photoUri) {
    return null;
  }

  const handleAnalyze = async (processedImageUri: string) => {
    const result = await analyzePhoto(processedImageUri);

    if (result.success) {
      // Dismiss camera + confirm modals, then navigate to log with results
      router.dismissAll();
      router.push({
        pathname: '/(app)/(tabs)/home/log',
        params: {
          analysisAmount: String(result.data.amount),
        },
      });
    } else {
      if (result.reason === 'subscription_required') {
        router.replace('/(app)/(tabs)/home/paywall');
        return;
      }
      if (result.reason === 'no_container_detected') {
        Alert.alert(t('log.noContainerDetected'), result.message, [
          { text: t('common.ok'), onPress: () => router.back() },
        ]);
        return;
      }
      Alert.alert(t('log.analysisFailed'), undefined, [
        { text: t('common.ok'), onPress: () => router.back() },
      ]);
    }
  };

  return (
    <ConfirmScreen
      photoUri={photoUri}
      onAnalyze={handleAnalyze}
      photoEditingDisabled
    />
  );
}
