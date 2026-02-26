import { DateTimePicker } from '@/components/core/date-time-picker';
import { Switch } from '@/components/core/switch';
import { Onboarding } from '@/components/onboarding/components';
import { Text } from '@/components/ui/text';
import { scheduleCheckInReminders } from '@/lib/app-specific/check-in-reminders';
import { requestPushPermissions } from '@/lib/push-notifications';
import { useAsyncStorage } from '@/providers/async-storage-provider';
import { capturePosthogEvent } from '@/utils/posthog';
import { Href } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Platform, View } from 'react-native';

const OnboardingReminderLayout = ({
  currentHref,
  canProceed,
  onProceed,
  onSkip,
  title,
  subtitle,
  reasons,
  children,
}: {
  currentHref: Href;
  canProceed: boolean;
  onProceed?: () => void | Promise<void>;
  onSkip?: () => void | Promise<void>;
  title: string;
  subtitle: string;
  reasons: ReactNode;
  children: ReactNode;
}) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (Platform.OS === 'android') return;

    const shake = Animated.sequence([
      Animated.delay(400),
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0.5,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -0.5,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]);
    shake.start();
  }, [shakeAnim]);

  const rotate = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-15deg', '15deg'],
  });

  return (
    <Onboarding.Container
      currentHref={currentHref}
      canProceed={canProceed}
      onProceed={onProceed}
      onSkip={onSkip}
    >
      {({ top, bottom, topToolbarHeight, bottomToolbarHeight }) => (
        <Onboarding.ScrollView
          topInset={top + topToolbarHeight}
          bottomInset={bottom + bottomToolbarHeight}
          alignCenter={true}
        >
          <Onboarding.TextContainer className="mx-8 flex-1">
            <Animated.View style={{ transform: [{ rotate }] }}>
              <Onboarding.IconBadge
                icon={Bell}
                color="blue"
                strokeWidth={1.5}
              />
            </Animated.View>
            <Onboarding.Title>{title}</Onboarding.Title>
            <Onboarding.Subtitle>{subtitle}</Onboarding.Subtitle>
            <View className="mt-6 gap-3">{reasons}</View>
            <View className="mt-6">{children}</View>
          </Onboarding.TextContainer>
        </Onboarding.ScrollView>
      )}
    </Onboarding.Container>
  );
};

type OnboardingReminderScreenProps = {
  currentHref: Href;
  title: string;
  subtitle: string;
  reasons: ReactNode;
};

export const OnboardingReminderTimePicker = ({
  currentHref,
  title,
  subtitle,
  reasons,
}: OnboardingReminderScreenProps) => {
  const { reminderSchedulePreferenceSetValue } = useAsyncStorage();

  const [selectedTime, setSelectedTime] = useState(() => {
    const d = new Date();
    d.setHours(7, 0, 0, 0);
    return d;
  });

  return (
    <OnboardingReminderLayout
      currentHref={currentHref}
      canProceed
      title={title}
      subtitle={subtitle}
      reasons={reasons}
      onProceed={async () => {
        const hour = selectedTime.getHours();
        const minute = selectedTime.getMinutes();
        const preference = {
          enabled: true,
          times: [{ hour, minute }],
        };
        reminderSchedulePreferenceSetValue(preference);

        capturePosthogEvent('onboarding-reminder-time', {
          answer: `${hour}:${String(minute).padStart(2, '0')}`,
        });

        await requestPushPermissions();
        await scheduleCheckInReminders(preference);
      }}
      onSkip={() => {
        reminderSchedulePreferenceSetValue({
          enabled: false,
          times: [],
        });

        capturePosthogEvent('onboarding-reminder-time', {
          answer: 'skipped',
        });
      }}
    >
      <View className="items-center">
        <DateTimePicker
          value={selectedTime}
          mode="time"
          iosDisplay="spinner"
          onChange={setSelectedTime}
          androidTextClassName="text-2xl"
        />
      </View>
    </OnboardingReminderLayout>
  );
};

export const OnboardingReminderSwitch = ({
  currentHref,
  title,
  subtitle,
  reasons,
}: OnboardingReminderScreenProps) => {
  const { t } = useTranslation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { reminderSchedulePreferenceValue } = useAsyncStorage();

  return (
    <OnboardingReminderLayout
      currentHref={currentHref}
      canProceed
      title={title}
      subtitle={subtitle}
      reasons={reasons}
      onProceed={async () => {
        if (notificationsEnabled) {
          capturePosthogEvent('onboarding-checkin-notifications-preference', {
            enabled: true,
          });
          await requestPushPermissions();
          if (reminderSchedulePreferenceValue) {
            await scheduleCheckInReminders(reminderSchedulePreferenceValue);
          }
        } else {
          capturePosthogEvent('onboarding-checkin-notifications-preference', {
            enabled: false,
          });
        }
      }}
    >
      <View className="h-20 flex-row items-center justify-between gap-2 rounded-xl bg-card px-4">
        <Text className="flex-1 text-center text-lg font-medium leading-none">
          {t('onboarding.checkInNotifications.turnOn')}
        </Text>
        <View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>
      </View>
    </OnboardingReminderLayout>
  );
};
