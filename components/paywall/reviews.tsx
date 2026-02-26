import { IMAGE_ASSETS, ImageAssetName } from '@/components/assets';
import { Text } from '@/components/ui/text';
import { clsx } from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';

type Review = {
  imageAssetName: ImageAssetName;
  name: string;
  messageKey: string;
};

const REVIEW_DATA: Review[] = [
  {
    imageAssetName: 'testimonial-jessica' as ImageAssetName,
    name: 'Sarah',
    messageKey: 'sarah',
  },
  {
    imageAssetName: 'testimonial-isaac' as ImageAssetName,
    name: 'Isaac',
    messageKey: 'isaac',
  },
  {
    imageAssetName: 'testimonial-shawna' as ImageAssetName,
    name: 'Emma',
    messageKey: 'emma',
  },
];

const ReviewMessage = ({
  name,
  message,
  imageAssetName,
}: {
  name: string;
  message: string;
  imageAssetName: ImageAssetName;
}) => {
  return (
    <View>
      <View className="rounded-xl bg-card px-5 py-3">
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
        <Text className={clsx('mt-4 text-md', {})}>{message}</Text>
      </View>
    </View>
  );
};

type ReviewKey =
  | 'paywall.reviews.sarah'
  | 'paywall.reviews.isaac'
  | 'paywall.reviews.emma';

export const Reviews = ({ className }: { className?: string }) => {
  const { t } = useTranslation();

  const reviews = useMemo(
    () =>
      REVIEW_DATA.map((review) => ({
        ...review,
        message: t(`paywall.reviews.${review.messageKey}` as ReviewKey),
      })),
    [t]
  );

  return (
    <View className={clsx('gap-4', className)}>
      {reviews.map((review, index) => (
        <ReviewMessage
          key={index}
          imageAssetName={review.imageAssetName}
          name={review.name}
          message={review.message}
        />
      ))}
    </View>
  );
};
