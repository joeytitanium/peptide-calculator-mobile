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
    screenshotModeValue,
  } = useAsyncStorage();
  const { hasActiveSubscription, isLoadingCustomerInfo } = useRevenueCat();

  useEffect(() => {
    if (installDateIsLoaded && isNil(installDateValue)) {
      installDateSetValue(new Date());
    }
  }, [installDateIsLoaded, installDateValue, installDateSetValue]);

  if (!onboardingCompletedIsLoaded || isLoadingCustomerInfo) {
    return null;
  }

  // New users: show onboarding
  if (!onboardingCompletedValue) {
    return <Redirect href="/(auth)/onboarding-1" />;
  }

  // Non-subscribers: show paywall on every app launch (skip in screenshot mode)
  if (!hasActiveSubscription && !screenshotModeValue) {
    return <Redirect href="/(auth)/paywall" />;
  }

  // Subscribers: go straight to app
  return <Redirect href="/(app)/(tabs)/calculator" />;
};

export default IndexScreen;
