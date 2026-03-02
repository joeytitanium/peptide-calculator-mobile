import { useAsyncStorage } from '@/providers/async-storage-provider';
import { useRevenueCat } from '@/providers/revenue-cat-provider';
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
    screenshotModeValue: screenshotMode,
    screenshotModeIsLoaded,
  } = useAsyncStorage();

  const { hasActiveSubscription, isLoadingCustomerInfo } = useRevenueCat();

  useEffect(() => {
    if (installDateIsLoaded && isNil(installDateValue)) {
      installDateSetValue(new Date());
    }
  }, [installDateIsLoaded, installDateValue, installDateSetValue]);

  if (!onboardingCompletedIsLoaded) {
    return null;
  }

  if (isLoadingCustomerInfo || !screenshotModeIsLoaded) {
    return null;
  }

  // New users: show onboarding flow
  if (!onboardingCompletedValue) {
    return <Redirect href="/(auth)/onboarding-welcome" />;
  }

  // Returning users without subscription: redirect to paywall
  if (!hasActiveSubscription && !__DEV__ && !screenshotMode) {
    return <Redirect href="/(auth)/paywall" />;
  }

  // Users with active subscription: go to app
  return <Redirect href="/(app)/(tabs)/calculator" />;
};

export default IndexScreen;
