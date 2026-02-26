import { CONFIG } from '@/config';
import * as Application from 'expo-application';
import { useFocusEffect } from 'expo-router';
import PostHog, { usePostHog } from 'posthog-react-native';
import { useCallback } from 'react';

export const POSTHOG_CLIENT = new PostHog(CONFIG.posthog.apiKey, {
  host: CONFIG.posthog.host,
});

export type JsonType =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonType }
  | JsonType[]
  | JsonType[];
type PostHogEventProperties = { [key: string]: JsonType };

export const formatViewedScreenEventName = (screenName: string) => {
  return `viewed-${screenName}-screen`;
};

/**
 * Hook that captures a PostHog event whenever the screen comes into focus
 * @param eventName - The name of the event to capture
 * @param properties - Optional properties to include with the event
 */
export const useViewedScreen = (
  screenName: string,
  properties?: PostHogEventProperties
) => {
  const posthog = usePostHog();

  useFocusEffect(
    useCallback(() => {
      posthog.capture(formatViewedScreenEventName(screenName), properties);
    }, [posthog, screenName, properties])
  );
};

export const capturePosthogEvent = (
  eventName: string,
  properties?: PostHogEventProperties
) => {
  POSTHOG_CLIENT.capture(eventName, {
    ...properties,
    'bundle-identifier': Application.applicationId,
  });
};
