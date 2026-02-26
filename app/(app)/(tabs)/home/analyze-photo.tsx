import { HeaderCloseButton } from '@/components/core/header-button';
import { AnalyzePhotoScreen } from '@/components/screens/app-specific/log/analyze-photo-screen';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function AnalyzePhotoModal() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('log.scanWithAI'),
          headerLeft: () => <HeaderCloseButton onPress={() => router.back()} />,
        }}
      />
      <AnalyzePhotoScreen
        onPhotoTaken={(uri) => {
          router.push({
            pathname: '/(app)/(tabs)/home/confirm-photo',
            params: { photoUri: uri },
          });
        }}
      />
    </>
  );
}
