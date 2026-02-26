import { DashboardScreen } from '@/components/screens/app-specific/dashboard';
import { useViewedScreen } from '@/utils/posthog';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const router = useRouter();
  useViewedScreen('dashboard');
  return (
    <DashboardScreen
      onAddLog={({ selectedDate }) =>
        router.push({
          pathname: '/(app)/(tabs)/dashboard/log',
          params: { date: selectedDate },
        })
      }
      onPresentPaywall={() => router.push('/paywall')}
    />
  );
}
