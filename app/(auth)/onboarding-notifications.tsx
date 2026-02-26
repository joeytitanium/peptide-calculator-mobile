import { GlowIcon } from '@/components/core/glow-icon';
import { OnboardingReminderTimePicker } from '@/components/screens/onboarding/onboarding-reminder';
import { Text } from '@/components/ui/text';
import { Bell, CalendarCheck } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

export default function OnboardingNotifications() {
  const { t } = useTranslation();

  return (
    <OnboardingReminderTimePicker
      currentHref="/(auth)/onboarding-notifications"
      title={t('onboarding.notifications.title')}
      subtitle={t('onboarding.notifications.subtitle')}
      reasons={
        <>
          <View className="flex-row items-center gap-3 rounded-xl px-4">
            <GlowIcon icon={Bell} color="blue" />
            <Text className="text-base">
              {t('onboarding.checkInNotifications.reason1')}
            </Text>
          </View>
          <View className="flex-row items-center gap-3 rounded-xl px-4">
            <GlowIcon icon={CalendarCheck} color="teal" />
            <Text className="text-base">
              {t('onboarding.checkInNotifications.reason2')}
            </Text>
          </View>
        </>
      }
    />
  );
}
