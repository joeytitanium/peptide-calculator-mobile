import { HeaderCloseButton } from '@/components/core/header-button';
import FeedbackScreen from '@/components/screens/feedback';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function FeedbackModal() {
  const router = useRouter();
  const { t } = useTranslation();
  const { rating } = useLocalSearchParams<{ rating: string }>();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('feedback.title'),
          headerLeft: () => <HeaderCloseButton onPress={() => router.back()} />,
        }}
      />
      <FeedbackScreen
        initialRating={Number(rating) ? Number(rating) : 3}
        onSuccess={() => router.back()}
      />
    </>
  );
}
