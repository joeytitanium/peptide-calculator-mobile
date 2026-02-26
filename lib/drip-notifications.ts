import * as Notifications from 'expo-notifications';
import i18n from './i18n';

const hoursToSeconds = (hours: number) => hours * 60 * 60;

const TRIAL_REMINDER_IDENTIFIER = 'trial_reminder';
const TRIAL_REMINDER_SECONDS = hoursToSeconds(48); // 2 days

// Notification message keys with exponential backoff timing
const DRIP_NOTIFICATION_KEYS = [
  {
    titleKey: 'notifications.drip.welcome.title',
    bodyKey: 'notifications.drip.welcome.body',
    seconds: hoursToSeconds(2),
  },
  {
    titleKey: 'notifications.drip.reminder1.title',
    bodyKey: 'notifications.drip.reminder1.body',
    seconds: hoursToSeconds(14),
  },
  {
    titleKey: 'notifications.drip.reminder2.title',
    bodyKey: 'notifications.drip.reminder2.body',
    seconds: hoursToSeconds(38),
  },
  {
    titleKey: 'notifications.drip.reminder3.title',
    bodyKey: 'notifications.drip.reminder3.body',
    seconds: hoursToSeconds(86),
  },
  {
    titleKey: 'notifications.drip.reminder4.title',
    bodyKey: 'notifications.drip.reminder4.body',
    seconds: hoursToSeconds(182),
  },
  {
    titleKey: 'notifications.drip.reminder5.title',
    bodyKey: 'notifications.drip.reminder5.body',
    seconds: hoursToSeconds(326),
  },
  {
    titleKey: 'notifications.drip.reminder6.title',
    bodyKey: 'notifications.drip.reminder6.body',
    seconds: hoursToSeconds(422),
  },
  {
    titleKey: 'notifications.drip.reminder7.title',
    bodyKey: 'notifications.drip.reminder7.body',
    seconds: hoursToSeconds(504),
  },
] as const;

export const scheduleDripNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status === Notifications.PermissionStatus.GRANTED) {
    // Schedule all notifications at once
    for (let i = 0; i < DRIP_NOTIFICATION_KEYS.length; i++) {
      const notification = DRIP_NOTIFICATION_KEYS[i];

      await Notifications.scheduleNotificationAsync({
        identifier: `drip_campaign_${i}`,
        content: {
          title: i18n.t(notification.titleKey),

          body: i18n.t(notification.bodyKey),
          data: {
            type: 'drip_campaign',
            index: i,
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: notification.seconds,
        },
      });
    }
  }
};

export const cancelAllDripNotifications = async () => {
  // Get all scheduled notifications
  const scheduledNotifications =
    await Notifications.getAllScheduledNotificationsAsync();

  // Cancel all drip campaign notifications
  for (const notification of scheduledNotifications) {
    if (notification.identifier.startsWith('drip_campaign_')) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
    }
  }
};

export const scheduleTrialReminderNotification = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status === Notifications.PermissionStatus.GRANTED) {
    await Notifications.scheduleNotificationAsync({
      identifier: TRIAL_REMINDER_IDENTIFIER,
      content: {
        title: i18n.t('notifications.drip.trialEnds'),
        data: { type: 'trial_reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: TRIAL_REMINDER_SECONDS,
      },
    });
  }
};

export const cancelTrialReminderNotification = async () => {
  await Notifications.cancelScheduledNotificationAsync(
    TRIAL_REMINDER_IDENTIFIER
  );
};

export type PaywallResult = 'dismissed' | 'trial' | 'subscribed';

export const handlePaywallComplete = async (result: PaywallResult) => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== Notifications.PermissionStatus.GRANTED) {
    return;
  }

  if (result === 'dismissed') {
    await scheduleDripNotifications();
  } else if (result === 'trial') {
    await scheduleTrialReminderNotification();
  }
  // 'subscribed' - no notifications needed
};
