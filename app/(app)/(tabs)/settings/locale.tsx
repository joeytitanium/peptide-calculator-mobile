import { LocalePicker } from '@/components/screens/app-specific/locale-picker';
import { useViewedScreen } from '@/utils/posthog';
import { useRouter } from 'expo-router';

export default function Locale() {
  const router = useRouter();
  useViewedScreen('settings-locale');

  return (
    <LocalePicker
      onSelect={() => router.back()}
      onCancel={() => router.back()}
    />
  );
}
