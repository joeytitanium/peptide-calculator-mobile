import { CalculatorScreen } from '@/components/screens/app-specific/calculator';
import { useViewedScreen } from '@/utils/posthog';

export default function Calculator() {
  useViewedScreen('calculator');
  return <CalculatorScreen />;
}
