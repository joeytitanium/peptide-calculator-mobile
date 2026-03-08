import { IMAGE_ASSETS, ImageAssetName } from '@/components/assets';
import { SlideUpRevealView } from '@/components/core/animations/slide-up-reveal-view';
import { Switch } from '@/components/core/switch';
import { Onboarding } from '@/components/onboarding/components';
import { Text } from '@/components/ui/text';
import { useDeterministicallyRequestReview } from '@/hooks/use-deterministically-request-review';
import { useColorScheme } from '@/lib/use-color-scheme';
import type { Href } from 'expo-router';
import { useState } from 'react';
import { Image, View } from 'react-native';

type Review = {
  imageAssetName: ImageAssetName;
  name: string;
  message: string;
};

type OnboardingReviewProps = {
  currentHref: Href;
  title: string;
  subtitle: string;
  reviews: Review[];
  switchLabel: string;
  onProceed?: () => Promise<void>;
};

const ReviewMessage = ({
  name,
  message,
  imageAssetName,
  cardColor,
}: {
  name: string;
  message: string;
  imageAssetName: ImageAssetName;
  cardColor: string;
}) => {
  return (
    <View>
      <View
        className="rounded-xl px-5 py-3"
        style={{ backgroundColor: cardColor }}
      >
        <View className="flex-row items-center justify-between gap-2">
          <View className="flex-row items-center gap-3">
            <Image
              source={IMAGE_ASSETS[imageAssetName]}
              className="h-10 w-10 rounded-full"
              resizeMode="cover"
            />
            <Text className="text-lg font-bold">{name}</Text>
          </View>
          <Text className="text-xl">⭐️⭐️⭐️⭐️⭐️</Text>
        </View>
        <Text className="mt-4 text-md">{message}</Text>
      </View>
    </View>
  );
};

export const OnboardingReview = ({
  currentHref,
  title,
  subtitle,
  reviews,
  switchLabel,
  onProceed,
}: OnboardingReviewProps) => {
  const { requestReview } = useDeterministicallyRequestReview();
  const { colors } = useColorScheme();
  const [reviewEnabled, setReviewEnabled] = useState(true);

  return (
    <Onboarding.Container
      currentHref={currentHref}
      canProceed
      onProceed={async () => {
        if (reviewEnabled) {
          await requestReview({ inAppOnly: true });
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        await onProceed?.();
      }}
    >
      {({ top, bottom, topToolbarHeight, bottomToolbarHeight }) => (
        <Onboarding.ScrollView
          topInset={topToolbarHeight + top}
          bottomInset={bottomToolbarHeight + bottom}
          alignCenter
        >
          <Onboarding.TextContainer>
            <Onboarding.Title className="mb-1 mt-4 text-4xl">
              ⭐️⭐️⭐️⭐️⭐️
            </Onboarding.Title>
            <Onboarding.Title>{title}</Onboarding.Title>
            <Onboarding.Subtitle>{subtitle}</Onboarding.Subtitle>
          </Onboarding.TextContainer>
          <View className="px-2 py-8">
            <View className="mb-4 flex-row items-center justify-between gap-2 rounded-xl bg-card px-4 py-5">
              <Text className="flex-1 text-lg font-medium">{switchLabel}</Text>
              <View>
                <Switch
                  value={reviewEnabled}
                  onValueChange={setReviewEnabled}
                />
              </View>
            </View>
            <View className="gap-4">
              {reviews.map((review, index) => (
                <SlideUpRevealView
                  key={review.name}
                  delay={150 * (index + 1)}
                >
                  <ReviewMessage
                    imageAssetName={review.imageAssetName}
                    name={review.name}
                    message={review.message}
                    cardColor={colors.card}
                  />
                </SlideUpRevealView>
              ))}
            </View>
          </View>
        </Onboarding.ScrollView>
      )}
    </Onboarding.Container>
  );
};
