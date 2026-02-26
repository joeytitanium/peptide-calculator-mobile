import HistoryScreen from '@/components/screens/history';
import { useViewedScreen } from '@/utils/posthog';
import { useRouter } from 'expo-router';

export default function History() {
  const router = useRouter();

  useViewedScreen('history');

  // Uncomment for hard paywall
  // useDeterministicallyPresentPaywall({
  //   onPresentPaywall: () => {
  //     router.replace('/paywall');
  //   },
  // });

  return (
    <HistoryScreen
      onPressRecord={(recordId) =>
        router.push({
          pathname: '/chat',
          params: {
            recordId,
          },
        })
      }
    />
  );
}
