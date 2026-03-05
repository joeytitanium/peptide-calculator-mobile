import { MasterDetailsCalendarScreen } from '@/components/screens/app-specific/master-details-calendar';
import { useViewedScreen } from '@/utils/posthog';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  useViewedScreen('home');
  const { date } = useLocalSearchParams<{ date?: string }>();

  return (
    <MasterDetailsCalendarScreen
      initialDateId={date}
      onAddLog={({ selectedDate }) =>
        router.push({
          pathname: '/(app)/(tabs)/home/log',
          params: { date: selectedDate },
        })
      }
      onPressRecord={({ recordId }) =>
        router.push({
          pathname: '/(app)/(tabs)/home/[recordId]',
          params: { recordId },
        })
      }
      onPresentPaywall={() => router.push('/(app)/paywall')}
    />
  );
}
