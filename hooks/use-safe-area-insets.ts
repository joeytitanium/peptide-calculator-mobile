import { useSafeAreaInsets as useRNSafeAreaInsets } from 'react-native-safe-area-context';

import { CONFIG } from '@/config';
import { Platform } from 'react-native';

const CONTENT_PADDING = 16;

type SafeAreaInsetPositions = 'top' | 'bottom' | 'both' | 'none';

const shouldApplyTop = (position: SafeAreaInsetPositions) =>
  position === 'top' || position === 'both';

const shouldApplyBottom = (position: SafeAreaInsetPositions) =>
  position === 'bottom' || position === 'both';

type UseSafeAreaInsetsParams = {
  nativePadding?: SafeAreaInsetPositions;
  navigationBarPadding?: SafeAreaInsetPositions;
  // initialWindowMetrics?: SafeAreaInsetPositions;
  contentPadding?: SafeAreaInsetPositions;
  additionalTopPadding?: number;
  additionalBottomPadding?: number;
};

/**
 * This all might need to change after NativeTabs is more mature
 */
const calculateIOSPadding = ({
  navigationBarPadding = 'both',
  contentPadding = 'both',
  additionalTopPadding = 0,
  additionalBottomPadding = 0,
  nativePadding = 'both',
  top = 0,
  bottom = 0,
}: UseSafeAreaInsetsParams & { top: number; bottom: number }) => {
  let paddingTop = 0;
  let paddingBottom = 0;

  if (shouldApplyTop(nativePadding)) {
    paddingTop += top;
  }
  if (shouldApplyTop(contentPadding)) {
    paddingTop += CONTENT_PADDING;
  }
  if (shouldApplyTop(navigationBarPadding)) {
    paddingTop += CONFIG.layout.navigationBarPadding;
  }
  paddingTop += additionalTopPadding;

  if (shouldApplyBottom(contentPadding)) {
    paddingBottom += CONTENT_PADDING;
  }
  if (shouldApplyBottom(nativePadding)) {
    paddingBottom += bottom;
  }
  paddingBottom += additionalBottomPadding;

  return { paddingTop, paddingBottom };
};

const calculateAndroidPadding = ({
  navigationBarPadding = 'both',
  // initialWindowMetrics = 'both',
  contentPadding = 'both',
  additionalTopPadding = 0,
  additionalBottomPadding = 0,
  // top = 0,
  // bottom = 0,
}: UseSafeAreaInsetsParams & { top: number; bottom: number }) => {
  let paddingTop = 0;
  let paddingBottom = 0;

  // if (shouldApplyTop(navigationBarPadding)) {
  //   paddingTop += CONFIG.layout.navigationBarPadding;
  // }
  if (shouldApplyTop(contentPadding)) {
    paddingTop += CONTENT_PADDING;
  }
  paddingTop += additionalTopPadding;

  if (shouldApplyBottom(contentPadding)) {
    paddingBottom += CONTENT_PADDING;
  }
  // if (shouldApplyBottom(initialWindowMetrics)) {
  //   paddingBottom += initialWindowMetricsRN?.insets.bottom ?? 0;
  // }
  // paddingBottom += StatusBar.currentHeight ?? 0;
  paddingBottom += additionalBottomPadding;

  return { paddingTop, paddingBottom };
};

export const useSafeAreaInsets = (params: UseSafeAreaInsetsParams = {}) => {
  const { top, bottom } = useRNSafeAreaInsets();

  const { paddingTop, paddingBottom } =
    Platform.OS === 'android'
      ? calculateAndroidPadding({ ...params, top, bottom })
      : calculateIOSPadding({ ...params, top, bottom });

  return {
    paddingTop,
    paddingBottom,
    top,
    bottom,
  };
};
