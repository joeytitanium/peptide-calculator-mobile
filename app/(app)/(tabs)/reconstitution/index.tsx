import { ReconstitutionScreen } from '@/components/screens/app-specific/reconstitution';
import { useViewedScreen } from '@/utils/posthog';

export default function Reconstitution() {
  useViewedScreen('reconstitution');
  return <ReconstitutionScreen />;
}
