import i18n from '@/lib/i18n';
import { ReminderSchedulePreference } from '@/utils/async-storage';
import * as Notifications from 'expo-notifications';

export const CHECK_IN_REMINDER_PREFIX = 'check-in-reminder-';

/**
 * Cancel all scheduled check-in reminders
 */
export const cancelAllCheckInReminders = async (): Promise<void> => {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of scheduled) {
    if (notification.identifier.startsWith(CHECK_IN_REMINDER_PREFIX)) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
    }
  }
};

/**
 * Schedule reminders at the specified times
 */
export const scheduleCheckInReminders = async (
  preference: ReminderSchedulePreference
): Promise<{ error?: Error }> => {
  // First cancel any existing check-in reminders
  await cancelAllCheckInReminders();

  if (!preference.enabled) {
    return {};
  }

  // Check permissions before scheduling
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== Notifications.PermissionStatus.GRANTED) {
    return { error: new Error('Notification permission not granted') };
  }

  try {
    for (let i = 0; i < preference.times.length; i++) {
      const { hour, minute } = preference.times[i];
      await Notifications.scheduleNotificationAsync({
        identifier: `${CHECK_IN_REMINDER_PREFIX}${i}`,
        content: {
          title: i18n.t('notifications.checkInReminder.title'),
          body: i18n.t('notifications.checkInReminder.body'),
          data: { type: 'check-in-reminder' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
    }

    return {};
  } catch (error) {
    return { error: error as Error };
  }
};
