import { ReviewSheetScreen } from '@/components/screens/app-specific/review-sheet';
import { storeUrl } from '@/hooks/use-deterministically-request-review';
import { useRouter } from 'expo-router';
import { Linking } from 'react-native';

export default function ReviewSheet() {
  const router = useRouter();

  return (
    <ReviewSheetScreen
      onRequestStoreReview={() => {
        router.dismiss();
        void Linking.openURL(storeUrl());
      }}
      onDismiss={() => router.dismissAll()}
    />
  );
}
