import { OnboardingSheet } from '@/components/screens/onboarding/onboarding-sheet';
import { useAsyncStorage } from '@/providers/async-storage-provider';
import { useRouter } from 'expo-router';

export default function OnboardingSheetModal() {
  const router = useRouter();
  const { onboardingCompletedSetValue } = useAsyncStorage();

  const handleContinue = () => {
    onboardingCompletedSetValue(true);
    router.replace('/');
  };

  return <OnboardingSheet onContinue={handleContinue} />;
}
