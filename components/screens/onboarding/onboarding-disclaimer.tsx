import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Onboarding } from '@/components/onboarding/components';
import { Href } from 'expo-router';
import { TriangleAlert } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

iconWithClassName(TriangleAlert);

export const OnboardingDisclaimer = ({
  title,
  content,
  href,
}: {
  title?: string;
  content?: string;
  href: Href;
}) => {
  const { t } = useTranslation();
  const displayTitle = title ?? t('disclaimer.title');
  const displayContent = content ?? t('disclaimer.content');
  return (
    <Onboarding.Container
      currentHref={href}
      canProceed
    >
      {({ top, bottom, topToolbarHeight, bottomToolbarHeight }) => (
        <Onboarding.ScrollView
          topInset={topToolbarHeight + top}
          bottomInset={bottomToolbarHeight + bottom}
          alignCenter
        >
          <View className="flex-1 justify-center items-center px-4">
            <View className="flex-row items-center justify-center gap-2 mb-4">
              <TriangleAlert
                size={28}
                className="text-foreground"
              />
              <Text className="text-2xl tracking-tight font-semibold text-center text-foreground">
                {displayTitle}
              </Text>
            </View>
            <Text className="text-muted-foreground text-center leading-5">
              {displayContent}
            </Text>
          </View>
        </Onboarding.ScrollView>
      )}
    </Onboarding.Container>
  );
};
