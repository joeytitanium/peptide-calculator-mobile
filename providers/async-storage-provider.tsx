import { useAsyncStorageItem } from '@/hooks/use-async-storage-item';
import { SortOrder } from '@/types/sort-order';
import { AuthState } from '@/utils/async-storage';
import React, { createContext, ReactNode, useContext, useMemo } from 'react';

type AsyncStorageContextType = {
  // sort-order-preference
  sortOrderPreferenceValue: ReturnType<
    typeof useAsyncStorageItem<'sort-order-preference'>
  >['value'];
  sortOrderPreferenceSetValue: ReturnType<
    typeof useAsyncStorageItem<'sort-order-preference'>
  >['setValue'];
  sortOrderPreferenceRemoveValue: ReturnType<
    typeof useAsyncStorageItem<'sort-order-preference'>
  >['removeValue'];
  sortOrderPreferenceIsLoaded: ReturnType<
    typeof useAsyncStorageItem<'sort-order-preference'>
  >['isLoaded'];

  // auth-token
  jwtTokenValue: ReturnType<typeof useAsyncStorageItem<'jwt-token'>>['value'];
  jwtTokenSetValue: ReturnType<
    typeof useAsyncStorageItem<'jwt-token'>
  >['setValue'];
  jwtTokenRemoveValue: ReturnType<
    typeof useAsyncStorageItem<'jwt-token'>
  >['removeValue'];
  jwtTokenIsLoaded: ReturnType<
    typeof useAsyncStorageItem<'jwt-token'>
  >['isLoaded'];

  // save-photo-preference
  savePhotoPreferenceValue: ReturnType<
    typeof useAsyncStorageItem<'save-photo-preference'>
  >['value'];
  savePhotoPreferenceSetValue: ReturnType<
    typeof useAsyncStorageItem<'save-photo-preference'>
  >['setValue'];
  savePhotoPreferenceRemoveValue: ReturnType<
    typeof useAsyncStorageItem<'save-photo-preference'>
  >['removeValue'];
  savePhotoPreferenceIsLoaded: ReturnType<
    typeof useAsyncStorageItem<'save-photo-preference'>
  >['isLoaded'];

  // onboarding-completed
  onboardingCompletedValue: ReturnType<
    typeof useAsyncStorageItem<'onboarding-completed'>
  >['value'];
  onboardingCompletedSetValue: ReturnType<
    typeof useAsyncStorageItem<'onboarding-completed'>
  >['setValue'];
  onboardingCompletedRemoveValue: ReturnType<
    typeof useAsyncStorageItem<'onboarding-completed'>
  >['removeValue'];
  onboardingCompletedIsLoaded: ReturnType<
    typeof useAsyncStorageItem<'onboarding-completed'>
  >['isLoaded'];

  // install-date
  installDateValue: ReturnType<
    typeof useAsyncStorageItem<'install-date'>
  >['value'];
  installDateSetValue: ReturnType<
    typeof useAsyncStorageItem<'install-date'>
  >['setValue'];
  installDateRemoveValue: ReturnType<
    typeof useAsyncStorageItem<'install-date'>
  >['removeValue'];
  installDateIsLoaded: ReturnType<
    typeof useAsyncStorageItem<'install-date'>
  >['isLoaded'];

  // last-paywall-shown-date
  lastPaywallShownDateValue: ReturnType<
    typeof useAsyncStorageItem<'last-paywall-shown-date'>
  >['value'];
  lastPaywallShownDateSetValue: ReturnType<
    typeof useAsyncStorageItem<'last-paywall-shown-date'>
  >['setValue'];
  lastPaywallShownDateRemoveValue: ReturnType<
    typeof useAsyncStorageItem<'last-paywall-shown-date'>
  >['removeValue'];
  lastPaywallShownDateIsLoaded: ReturnType<
    typeof useAsyncStorageItem<'last-paywall-shown-date'>
  >['isLoaded'];

  // last-review-request-date
  lastReviewRequestDateValue: ReturnType<
    typeof useAsyncStorageItem<'last-review-request-date'>
  >['value'];
  lastReviewRequestDateSetValue: ReturnType<
    typeof useAsyncStorageItem<'last-review-request-date'>
  >['setValue'];
  lastReviewRequestDateRemoveValue: ReturnType<
    typeof useAsyncStorageItem<'last-review-request-date'>
  >['removeValue'];
  lastReviewRequestDateIsLoaded: ReturnType<
    typeof useAsyncStorageItem<'last-review-request-date'>
  >['isLoaded'];

  // auth-state
  authStateValue: ReturnType<typeof useAsyncStorageItem<'auth-state'>>['value'];
  authStateSetValue: ReturnType<
    typeof useAsyncStorageItem<'auth-state'>
  >['setValue'];
  authStateRemoveValue: ReturnType<
    typeof useAsyncStorageItem<'auth-state'>
  >['removeValue'];
  authStateIsLoaded: ReturnType<
    typeof useAsyncStorageItem<'auth-state'>
  >['isLoaded'];

  // crop-region-preference
  cropRegionPreferenceValue: ReturnType<
    typeof useAsyncStorageItem<'crop-region-preference'>
  >['value'];
  cropRegionPreferenceSetValue: ReturnType<
    typeof useAsyncStorageItem<'crop-region-preference'>
  >['setValue'];
  cropRegionPreferenceRemoveValue: ReturnType<
    typeof useAsyncStorageItem<'crop-region-preference'>
  >['removeValue'];
  cropRegionPreferenceIsLoaded: ReturnType<
    typeof useAsyncStorageItem<'crop-region-preference'>
  >['isLoaded'];

  // screenshot-mode
  screenshotModeValue: ReturnType<
    typeof useAsyncStorageItem<'screenshot-mode'>
  >['value'];
  screenshotModeSetValue: ReturnType<
    typeof useAsyncStorageItem<'screenshot-mode'>
  >['setValue'];
  screenshotModeRemoveValue: ReturnType<
    typeof useAsyncStorageItem<'screenshot-mode'>
  >['removeValue'];
  screenshotModeIsLoaded: ReturnType<
    typeof useAsyncStorageItem<'screenshot-mode'>
  >['isLoaded'];

  // reminder-schedule-preference
  reminderSchedulePreferenceValue: ReturnType<
    typeof useAsyncStorageItem<'reminder-schedule-preference'>
  >['value'];
  reminderSchedulePreferenceSetValue: ReturnType<
    typeof useAsyncStorageItem<'reminder-schedule-preference'>
  >['setValue'];
  reminderSchedulePreferenceRemoveValue: ReturnType<
    typeof useAsyncStorageItem<'reminder-schedule-preference'>
  >['removeValue'];
  reminderSchedulePreferenceIsLoaded: ReturnType<
    typeof useAsyncStorageItem<'reminder-schedule-preference'>
  >['isLoaded'];

  // headache-preference
  headachePreferenceValue: ReturnType<
    typeof useAsyncStorageItem<'headache-preference'>
  >['value'];
  headachePreferenceSetValue: ReturnType<
    typeof useAsyncStorageItem<'headache-preference'>
  >['setValue'];
  headachePreferenceRemoveValue: ReturnType<
    typeof useAsyncStorageItem<'headache-preference'>
  >['removeValue'];
  headachePreferenceIsLoaded: ReturnType<
    typeof useAsyncStorageItem<'headache-preference'>
  >['isLoaded'];

  // locale-preference
  localePreferenceValue: ReturnType<
    typeof useAsyncStorageItem<'locale-preference'>
  >['value'];
  localePreferenceSetValue: ReturnType<
    typeof useAsyncStorageItem<'locale-preference'>
  >['setValue'];
  localePreferenceRemoveValue: ReturnType<
    typeof useAsyncStorageItem<'locale-preference'>
  >['removeValue'];
  localePreferenceIsLoaded: ReturnType<
    typeof useAsyncStorageItem<'locale-preference'>
  >['isLoaded'];
};

const AsyncStorageContext = createContext<AsyncStorageContextType | undefined>(
  undefined
);

export const AsyncStorageProvider = ({ children }: { children: ReactNode }) => {
  const defaultSavePhotoPreference = useMemo(() => true, []);
  const defaultOnboardingCompleted = useMemo(() => false, []);
  const defaultJwtToken = useMemo(() => undefined, []);
  const defaultSortOrderPreference: SortOrder = useMemo(
    () => 'date-newest',
    []
  );

  const sortOrderPreference = useAsyncStorageItem({
    key: 'sort-order-preference',
    defaultValue: defaultSortOrderPreference,
  });

  const jwtToken = useAsyncStorageItem({
    key: 'jwt-token',
    defaultValue: defaultJwtToken,
  });

  const onboardingCompleted = useAsyncStorageItem({
    key: 'onboarding-completed',
    defaultValue: defaultOnboardingCompleted,
  });

  const installDate = useAsyncStorageItem({
    key: 'install-date',
  });

  const lastPaywallShownDate = useAsyncStorageItem({
    key: 'last-paywall-shown-date',
  });

  const savePhotoPreference = useAsyncStorageItem({
    key: 'save-photo-preference',
    defaultValue: defaultSavePhotoPreference,
  });

  const lastReviewRequestDate = useAsyncStorageItem({
    key: 'last-review-request-date',
  });

  const defaultAuthState: AuthState = useMemo(
    () => ({
      appleUserId: null,
      identityToken: null,
      username: null,
      profileImageUrl: null,
    }),
    []
  );

  const authState = useAsyncStorageItem({
    key: 'auth-state',
    defaultValue: defaultAuthState,
  });

  const cropRegionPreference = useAsyncStorageItem({
    key: 'crop-region-preference',
  });

  const screenshotMode = useAsyncStorageItem({
    key: 'screenshot-mode',
    defaultValue: false,
  });

  const reminderSchedulePreference = useAsyncStorageItem({
    key: 'reminder-schedule-preference',
  });

  const headachePreference = useAsyncStorageItem({
    key: 'headache-preference',
  });

  const localePreference = useAsyncStorageItem({
    key: 'locale-preference',
  });

  const contextValue = useMemo(
    () => ({
      sortOrderPreferenceValue: sortOrderPreference.value,
      sortOrderPreferenceSetValue: sortOrderPreference.setValue,
      sortOrderPreferenceRemoveValue: sortOrderPreference.removeValue,
      sortOrderPreferenceIsLoaded: sortOrderPreference.isLoaded,

      jwtTokenValue: jwtToken.value,
      jwtTokenSetValue: jwtToken.setValue,
      jwtTokenRemoveValue: jwtToken.removeValue,
      jwtTokenIsLoaded: jwtToken.isLoaded,

      onboardingCompletedValue: onboardingCompleted.value,
      onboardingCompletedSetValue: onboardingCompleted.setValue,
      onboardingCompletedRemoveValue: onboardingCompleted.removeValue,
      onboardingCompletedIsLoaded: onboardingCompleted.isLoaded,

      installDateValue: installDate.value,
      installDateSetValue: installDate.setValue,
      installDateRemoveValue: installDate.removeValue,
      installDateIsLoaded: installDate.isLoaded,

      lastPaywallShownDateValue: lastPaywallShownDate.value,
      lastPaywallShownDateSetValue: lastPaywallShownDate.setValue,
      lastPaywallShownDateRemoveValue: lastPaywallShownDate.removeValue,
      lastPaywallShownDateIsLoaded: lastPaywallShownDate.isLoaded,

      savePhotoPreferenceValue: savePhotoPreference.value,
      savePhotoPreferenceSetValue: savePhotoPreference.setValue,
      savePhotoPreferenceRemoveValue: savePhotoPreference.removeValue,
      savePhotoPreferenceIsLoaded: savePhotoPreference.isLoaded,

      lastReviewRequestDateValue: lastReviewRequestDate.value,
      lastReviewRequestDateSetValue: lastReviewRequestDate.setValue,
      lastReviewRequestDateRemoveValue: lastReviewRequestDate.removeValue,
      lastReviewRequestDateIsLoaded: lastReviewRequestDate.isLoaded,

      authStateValue: authState.value,
      authStateSetValue: authState.setValue,
      authStateRemoveValue: authState.removeValue,
      authStateIsLoaded: authState.isLoaded,

      cropRegionPreferenceValue: cropRegionPreference.value,
      cropRegionPreferenceSetValue: cropRegionPreference.setValue,
      cropRegionPreferenceRemoveValue: cropRegionPreference.removeValue,
      cropRegionPreferenceIsLoaded: cropRegionPreference.isLoaded,

      screenshotModeValue: screenshotMode.value,
      screenshotModeSetValue: screenshotMode.setValue,
      screenshotModeRemoveValue: screenshotMode.removeValue,
      screenshotModeIsLoaded: screenshotMode.isLoaded,

      reminderSchedulePreferenceValue: reminderSchedulePreference.value,
      reminderSchedulePreferenceSetValue: reminderSchedulePreference.setValue,
      reminderSchedulePreferenceRemoveValue:
        reminderSchedulePreference.removeValue,
      reminderSchedulePreferenceIsLoaded: reminderSchedulePreference.isLoaded,

      headachePreferenceValue: headachePreference.value,
      headachePreferenceSetValue: headachePreference.setValue,
      headachePreferenceRemoveValue: headachePreference.removeValue,
      headachePreferenceIsLoaded: headachePreference.isLoaded,

      localePreferenceValue: localePreference.value,
      localePreferenceSetValue: localePreference.setValue,
      localePreferenceRemoveValue: localePreference.removeValue,
      localePreferenceIsLoaded: localePreference.isLoaded,
    }),
    [
      sortOrderPreference.value,
      sortOrderPreference.setValue,
      sortOrderPreference.removeValue,
      sortOrderPreference.isLoaded,
      jwtToken.value,
      jwtToken.setValue,
      jwtToken.removeValue,
      jwtToken.isLoaded,
      onboardingCompleted.value,
      onboardingCompleted.setValue,
      onboardingCompleted.removeValue,
      onboardingCompleted.isLoaded,
      installDate.value,
      installDate.setValue,
      installDate.removeValue,
      installDate.isLoaded,
      lastPaywallShownDate.value,
      lastPaywallShownDate.setValue,
      lastPaywallShownDate.removeValue,
      lastPaywallShownDate.isLoaded,
      savePhotoPreference.value,
      savePhotoPreference.setValue,
      savePhotoPreference.removeValue,
      savePhotoPreference.isLoaded,
      lastReviewRequestDate.value,
      lastReviewRequestDate.setValue,
      lastReviewRequestDate.removeValue,
      lastReviewRequestDate.isLoaded,
      authState.value,
      authState.setValue,
      authState.removeValue,
      authState.isLoaded,
      cropRegionPreference.value,
      cropRegionPreference.setValue,
      cropRegionPreference.removeValue,
      cropRegionPreference.isLoaded,
      screenshotMode.value,
      screenshotMode.setValue,
      screenshotMode.removeValue,
      screenshotMode.isLoaded,
      reminderSchedulePreference.value,
      reminderSchedulePreference.setValue,
      reminderSchedulePreference.removeValue,
      reminderSchedulePreference.isLoaded,
      headachePreference.value,
      headachePreference.setValue,
      headachePreference.removeValue,
      headachePreference.isLoaded,
      localePreference.value,
      localePreference.setValue,
      localePreference.removeValue,
      localePreference.isLoaded,
    ]
  );

  return (
    <AsyncStorageContext.Provider value={contextValue}>
      {children}
    </AsyncStorageContext.Provider>
  );
};

export const useAsyncStorage = () => {
  const context = useContext(AsyncStorageContext);
  if (context === undefined) {
    throw new Error(
      'useAsyncStorageContext must be used within an AsyncStorageProvider'
    );
  }
  return context;
};
