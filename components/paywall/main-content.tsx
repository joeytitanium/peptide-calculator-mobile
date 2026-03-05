import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { presentInAppBrowser } from '@/utils/present-in-app-browser';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Timeline } from '@/components/core/timeline';
import { AppStoreRatingWreath, BestAppWreath } from '@/components/core/wreath';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Button } from '@/components/ui/button';
import { BellRing, CreditCard, LockKeyholeOpen } from 'lucide-react-native';
import { PerksList } from './perks-list';
import { Reviews } from './reviews';

iconWithClassName(BellRing);
iconWithClassName(CreditCard);
iconWithClassName(LockKeyholeOpen);

export const FooterLinks = ({
  onRestorePurchase,
  className,
}: {
  onRestorePurchase: () => void;
  className?: string;
}) => {
  const { t } = useTranslation();
  return (
    <View className={className}>
      <View className="flex-row justify-center items-center gap-4">
        <Button
          variant="link"
          className="h-auto native:h-auto py-0 native:py-0"
          onPress={() => presentInAppBrowser({ url: CONFIG.termsOfServiceUrl })}
        >
          <Text className="underline text-muted-foreground">
            {t('paywall.footer.terms')}
          </Text>
        </Button>
        <Button
          variant="link"
          className="h-auto native:h-auto py-0 native:py-0"
          onPress={onRestorePurchase}
        >
          <Text className="underline text-muted-foreground">
            {t('paywall.footer.restorePurchase')}
          </Text>
        </Button>
        <Button
          variant="link"
          className="h-auto native:h-auto py-0 native:py-0"
          onPress={() => presentInAppBrowser({ url: CONFIG.privacyPolicyUrl })}
        >
          <Text className="underline text-muted-foreground">
            {t('paywall.footer.privacy')}
          </Text>
        </Button>
      </View>
    </View>
  );
};

type ContainerProps = {
  title: string;
  subtitle?: string;
  onRestorePurchase: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

type PolymorphicProps = Omit<ContainerProps, 'title' | 'subtitle' | 'children'>;

const ContainerView = ({
  title,
  subtitle,
  onRestorePurchase,
  children,
  style,
  wreathTitle,
}: ContainerProps & { children: ReactNode; wreathTitle: string }) => (
  <ScrollView
    className="flex-1 py-6"
    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
    showsVerticalScrollIndicator={false}
    style={style}
  >
    <Animated.View
      entering={FadeInUp.delay(100).duration(600).springify()}
      className="pb-2"
    >
      <Animated.View
        entering={FadeInUp.delay(300).duration(600).springify()}
        className="mt-8 w-full px-4 items-center"
      >
        <Text className="text-balance text-center text-2xl font-bold max-w-[300px]">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-balance text-center text-muted-foreground text-base max-w-[300px]">
            {subtitle}
          </Text>
        )}
      </Animated.View>
    </Animated.View>
    <View className="px-4">{children}</View>
    <Animated.View
      entering={FadeInUp.delay(700).duration(600).springify()}
      className="px-4"
    >
      <View className="flex-row justify-center items-center my-4">
        <View className="flex-1">
          <AppStoreRatingWreath />
        </View>
        <View className="flex-1">
          <BestAppWreath title={wreathTitle} />
        </View>
      </View>
      <Reviews className="mt-4" />
      <FooterLinks
        className="my-2"
        onRestorePurchase={onRestorePurchase}
      />
    </Animated.View>

    {/* {showReviewCarousel && (
        <Animated.View
          entering={FadeInUp.delay(700).duration(600).springify()}
          className="py-10"
        >
          <ReviewCarousel />
        </Animated.View>
      )} */}
  </ScrollView>
);

export const TrialView = (props: PolymorphicProps & { trialDays?: number }) => {
  const { trialDays = 3, ...rest } = props;
  const { t } = useTranslation();
  return (
    <ContainerView
      title={t('paywall.trial.title', { days: trialDays })}
      subtitle={t('paywall.trial.subtitle')}
      wreathTitle={t('paywall.wreath.bestHealthApp')}
      {...rest}
    >
      <Timeline
        items={[
          {
            icon: LockKeyholeOpen,
            title: t('paywall.trial.today'),
            subtitle: t('paywall.trial.todaySubtitle'),
          },
          {
            icon: BellRing,
            title: t('paywall.trial.inTwoDays'),
            subtitle: t('paywall.trial.inTwoDaysSubtitle'),
          },
          {
            icon: CreditCard,
            title: t('paywall.trial.inThreeDays'),
            subtitle: t('paywall.trial.inThreeDaysSubtitle'),
          },
        ]}
      />
    </ContainerView>
  );
};

export const NonTrialView = (props: PolymorphicProps) => {
  const { t } = useTranslation();
  const heroTitle = CONFIG.isHardPaywall
    ? t('paywall.nonTrial.titleHard')
    : t('paywall.nonTrial.titleSoft');

  return (
    <ContainerView
      title={heroTitle}
      subtitle={t('paywall.nonTrial.subtitle')}
      wreathTitle={t('paywall.wreath.bestHealthApp')}
      {...props}
    >
      <PerksList className="mt-3" />
    </ContainerView>
  );
};
