import { BlendScreen } from '@/components/screens/app-specific/blend';
import { useViewedScreen } from '@/utils/posthog';

export default function Blend() {
  useViewedScreen('blend');
  return <BlendScreen />;
}
