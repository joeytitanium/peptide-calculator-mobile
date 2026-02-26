import { useAsyncStorage } from '@/providers/async-storage-provider';
import { logError } from '@/utils/logger';
import { isBefore, subMinutes } from 'date-fns';
import Constants from 'expo-constants';
import * as StoreReview from 'expo-store-review';
import { Linking, Platform } from 'react-native';

const LAST_REVIEW_REQUEST_THRESHOLD_MINUTES: number = __DEV__ ? 3 : 24 * 60;

type RequestReviewOptions = {
  inAppOnly?: boolean;
  totalLogCount?: number;
};

export const storeUrl = () => {
  if (Platform.OS === 'android') {
    return `https://play.google.com/store/apps/details?id=${Constants.expoConfig?.android?.package}&showAllReviews=true`;
  }
  return `https://apps.apple.com/app/apple-store/id${StoreReview.storeUrl()}?action=write-review`;
};

export const requestReviewHandler = async ({
  inAppOnly = false,
}: RequestReviewOptions = {}) => {
  try {
    if (
      (await StoreReview.hasAction()) &&
      (await StoreReview.isAvailableAsync())
    ) {
      await StoreReview.requestReview();
    } else {
      if (inAppOnly) {
        return;
      }
      if (await Linking.canOpenURL(storeUrl())) {
        await Linking.openURL(storeUrl());
      }
    }
  } catch (error) {
    logError({
      message: 'Error requesting store review action',
      error,
    });
  }
};

export const useDeterministicallyRequestReview = () => {
  const {
    lastReviewRequestDateValue,
    lastReviewRequestDateSetValue,
    lastReviewRequestDateIsLoaded,
  } = useAsyncStorage();

  const requestReview = async (options?: RequestReviewOptions) => {
    // Wait for the last review request date to load from async storage
    if (!lastReviewRequestDateIsLoaded) {
      return;
    }

    // When triggered by log count, only prompt after 1st log then every 3 logs
    if (
      options?.totalLogCount != null &&
      options.totalLogCount !== 1 &&
      (options.totalLogCount - 1) % 3 !== 0
    ) {
      return;
    }

    const now = new Date();

    const shouldRequest =
      !lastReviewRequestDateValue ||
      isBefore(
        new Date(lastReviewRequestDateValue),
        subMinutes(now, LAST_REVIEW_REQUEST_THRESHOLD_MINUTES)
      );

    if (shouldRequest) {
      void requestReviewHandler(options);
      lastReviewRequestDateSetValue(now);
    }
  };

  return { requestReview, isLoaded: lastReviewRequestDateIsLoaded };
};
