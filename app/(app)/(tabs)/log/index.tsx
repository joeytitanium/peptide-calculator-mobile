import { LogHeadacheForm } from '@/components/screens/app-specific/log/log-headache-form';
import { useViewedScreen } from '@/utils/posthog';

export default function LogScreen() {
  useViewedScreen('log');

  return <LogHeadacheForm />;
}
