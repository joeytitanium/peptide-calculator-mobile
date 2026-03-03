import { useAsyncStorage } from '@/providers/async-storage-provider';
import { Redirect } from 'expo-router';
import { isNil } from 'lodash';
import { useEffect } from 'react';

const IndexScreen = () => {
  const {
    installDateValue,
    installDateIsLoaded,
    installDateSetValue,
    onboardingCompletedValue,
    onboardingCompletedIsLoaded,
  } = useAsyncStorage();

  useEffect(() => {
    if (installDateIsLoaded && isNil(installDateValue)) {
      installDateSetValue(new Date());
    }
  }, [installDateIsLoaded, installDateValue, installDateSetValue]);

  if (!onboardingCompletedIsLoaded) {
    return null;
  }

  // New users: show onboarding sheet
  if (!onboardingCompletedValue) {
    return <Redirect href="/(auth)/onboarding-sheet" />;
  }

  // Go to app (free users get gated at the feature level)
  return <Redirect href="/(app)/(tabs)/calculator" />;
};

export default IndexScreen;
