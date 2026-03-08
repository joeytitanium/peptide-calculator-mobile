import { IMAGE_ASSETS } from '@/components/assets';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { PerksList } from '@/components/paywall/perks-list';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { Save } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

iconWithClassName(Save);

type OnboardingSheetProps = {
  onContinue: () => void;
};

export function OnboardingSheet({ onContinue }: OnboardingSheetProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6"
      >
        {/* App Icon */}
        <View className="items-center pt-16 pb-8">
          <View
            style={{
              shadowColor: CONFIG.tintColor.hex,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 40,
            }}
          >
            <Image
              source={IMAGE_ASSETS['app-icon']}
              className="w-24 h-24 rounded-3xl"
            />
          </View>
        </View>

        {/* Welcome Text */}
        <View className="items-center pb-12">
          <Text className="text-4xl text-center font-bold text-foreground leading-tight tracking-tight">
            {t('onboarding.sheet.welcomeTo')}
          </Text>
          <Text className="text-4xl text-center font-bold text-foreground mb-2 leading-tight tracking-tight">
            {CONFIG.site.name}
          </Text>
          <Text className="text-lg text-muted-foreground text-center">
            {t('common.appDescription')}
          </Text>
        </View>

        {/* Perks List */}
        <PerksList />
      </ScrollView>

      {/* Continue Button */}
      <View className="px-6 pb-6">
        <Pressable
          onPress={onContinue}
          className="bg-primary rounded-2xl py-4 items-center active:opacity-80"
        >
          <Text className="text-primary-foreground text-lg font-semibold">
            {t('onboarding.button.continue')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
