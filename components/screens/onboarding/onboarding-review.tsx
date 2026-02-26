import { IMAGE_ASSETS, ImageAssetName } from '@/components/assets';
import { SlideUpRevealView } from '@/components/core/animations/slide-up-reveal-view';
import { Onboarding } from '@/components/onboarding/components';
import { Text } from '@/components/ui/text';
import { useDeterministicallyRequestReview } from '@/hooks/use-deterministically-request-review';
import { useColorScheme } from '@/lib/use-color-scheme';
import type { Href } from 'expo-router';
import { useEffect } from 'react';
import { Image, View } from 'react-native';

type Review = {
  imageAssetName: ImageAssetName;
  name: string;
  message: string;
};

interface OnboardingReviewProps {
  currentHref: Href;
  title: string;
  subtitle: string;
  reviews: Review[];
  onProceed?: () => Promise<void>;
}

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
  onProceed,
}: OnboardingReviewProps) => {
  const { requestReview } = useDeterministicallyRequestReview();
  const { colors } = useColorScheme();

  useEffect(() => {
    void requestReview({ inAppOnly: true });
  }, [requestReview]);

  return (
    <Onboarding.Container
      currentHref={currentHref}
      canProceed
      onProceed={onProceed}
    >
      {({ top, bottom, topToolbarHeight, bottomToolbarHeight }) => (
        <Onboarding.ScrollView
          topInset={topToolbarHeight + top}
          bottomInset={bottomToolbarHeight + bottom}
        >
          <Onboarding.TextContainer>
            <Onboarding.Title className="mb-1 mt-4 text-4xl">
              ⭐️⭐️⭐️⭐️⭐️
            </Onboarding.Title>
            <Onboarding.Title>{title}</Onboarding.Title>
            <Onboarding.Subtitle>{subtitle}</Onboarding.Subtitle>
          </Onboarding.TextContainer>
          <View className="gap-4 px-2 py-8">
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
        </Onboarding.ScrollView>
      )}
    </Onboarding.Container>
  );
};
