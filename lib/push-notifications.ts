import { fetchApi } from '@/lib/api/fetch-api';
import {
  getAsyncStorageItem,
  removeAsyncStorageItem,
  setAsyncStorageItem,
} from '@/utils/async-storage';
import { logDebugMessage } from '@/utils/logger';
import { MutuallyExclusiveResult, tryCatch } from '@/utils/try-catch';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { z } from 'zod';

/**
 * Push notification trigger schema (contains the payload)
 */
const PUSH_NOTIFICATION_TRIGGER_SCHEMA = z.object({
  payload: z.object({
    type: z.enum(['vote', 'comment']).optional(),
    postId: z.string().optional(),
  }),
});

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request push notification permissions and get the device token.
 * Does NOT register with backend - use registerPushTokenWithBackend for that.
 */
export const getPushToken = async (): Promise<
  MutuallyExclusiveResult<{ token: string }>
> => {
  // Push notifications only work on physical devices
  if (!Device.isDevice) {
    return {
      error: new Error('Push notifications require a physical device'),
    };
  }

  // Check/request permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== Notifications.PermissionStatus.GRANTED) {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== Notifications.PermissionStatus.GRANTED) {
    return { error: new Error('Push notification permission denied') };
  }

  // Get the push token
  const { data: tokenResult, error: tokenError } = await tryCatch(
    Notifications.getDevicePushTokenAsync()
  );

  if (tokenError ?? !tokenResult) {
    logDebugMessage({
      message: 'Failed to get push token',
      context: { error: tokenError },
    });
    return { error: new Error('Failed to get device push token') };
  }

  return { data: { token: tokenResult.data } };
};

const DEVICE_TOKEN_RESPONSE_SCHEMA = z.object({
  id: z.string(),
});

/**
 * Register the device push token with the backend.
 * Requires user to be authenticated with Apple Sign In.
 */
export const registerPushTokenWithBackend = async (
  deviceToken: string
): Promise<{ error?: Error }> => {
  const { data: response, error: fetchError } = await tryCatch(
    fetchApi({
      method: 'POST',
      path: '/device-tokens',
      body: { deviceToken },
      schema: DEVICE_TOKEN_RESPONSE_SCHEMA,
    })
  );

  if (fetchError) {
    logDebugMessage({
      message: 'Failed to register push token with backend',
      context: { error: fetchError },
    });
    return { error: new Error('Network error registering push token') };
  }

  if (!response.success) {
    logDebugMessage({
      message: 'Backend rejected push token registration',
      context: { message: response.publicFacingMessage },
    });
    return {
      error: new Error(
        response.publicFacingMessage ?? 'Failed to register push token'
      ),
    };
  }

  // Store the token locally for later unregistration
  await setAsyncStorageItem({
    key: 'push-device-token',
    value: deviceToken,
  });

  logDebugMessage({
    message: 'Push token registered successfully',
    context: { deviceToken: deviceToken.substring(0, 20) + '...' },
  });

  return {};
};

/**
 * Unregister the device push token from the backend.
 * Call this when user signs out.
 */
export const unregisterPushTokenFromBackend = async (): Promise<{
  error?: Error;
}> => {
  const storedToken = await getAsyncStorageItem('push-device-token');

  if (!storedToken.data) {
    // No token to unregister
    return {};
  }

  const { data: response, error: fetchError } = await tryCatch(
    fetchApi({
      method: 'DELETE',
      path: '/device-tokens',
      body: { deviceToken: storedToken.data },
      schema: DEVICE_TOKEN_RESPONSE_SCHEMA,
    })
  );

  // Clear local token regardless of backend response
  await removeAsyncStorageItem('push-device-token');

  if (fetchError || !response.success) {
    logDebugMessage({
      message: 'Failed to unregister push token from backend',
      context: { error: fetchError },
    });
    // Don't fail - token is cleared locally
    return {};
  }

  logDebugMessage({
    message: 'Push token unregistered successfully',
    context: {},
  });

  return {};
};

/**
 * Request push notification permissions and store the token locally.
 * Does NOT register with backend - that happens on sign-in via refreshPushTokenRegistration.
 * Use this during onboarding when the user enables notifications.
 */
export const requestPushPermissions = async (): Promise<{
  error?: Error;
}> => {
  const { data, error } = await getPushToken();

  if (error) {
    return { error };
  }

  // Store token locally for later backend registration
  await setAsyncStorageItem({
    key: 'push-device-token',
    value: data.token,
  });

  return {};
};

/**
 * Re-register push token with backend.
 * Call this after user signs in to ensure token is associated with their account.
 */
export const refreshPushTokenRegistration = async (): Promise<{
  error?: Error;
}> => {
  // Check if we have permissions
  const { status } = await Notifications.getPermissionsAsync();

  if (status !== Notifications.PermissionStatus.GRANTED) {
    // User hasn't enabled notifications, nothing to refresh
    return {};
  }

  const { data, error } = await getPushToken();

  if (error) {
    return { error };
  }

  return registerPushTokenWithBackend(data.token);
};

/**
 * Handle navigation when a notification is tapped
 */
const handleNotificationResponse = (
  response: Notifications.NotificationResponse
) => {
  // Check if it's a push notification - data is in trigger.payload
  const pushParsed = PUSH_NOTIFICATION_TRIGGER_SCHEMA.safeParse(
    response.notification.request.trigger
  );

  if (!pushParsed.success) {
    logDebugMessage({
      message: 'Invalid notification trigger',
      context: { error: pushParsed.error },
    });
    return;
  }

  const { type, postId } = pushParsed.data.payload;

  logDebugMessage({
    message: 'Push notification tapped',
    context: { type, postId },
  });

  // Both 'vote' and 'comment' notifications navigate to the post's comments page
  if (postId) {
    router.push(`/(app)/(tabs)/feed/comments/${postId}`);
  }
};

/**
 * Hook to set up notification response listeners.
 * Call this in the root layout to handle deep linking from notifications.
 */
export const useNotificationResponseListener = () => {
  useEffect(() => {
    // Handle notification that was tapped while app was in background/killed
    const checkLastNotificationResponse = async () => {
      const lastResponse =
        await Notifications.getLastNotificationResponseAsync();
      if (lastResponse) {
        handleNotificationResponse(lastResponse);
      }
    };
    void checkLastNotificationResponse();

    // Handle notification taps while app is running
    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    return () => {
      subscription.remove();
    };
  }, []);
};
