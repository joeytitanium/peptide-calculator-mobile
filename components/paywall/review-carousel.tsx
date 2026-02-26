import { IMAGE_ASSETS } from '@/components/assets';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useColorScheme } from '@/lib/use-color-scheme';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, useWindowDimensions, View, ViewProps } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import colors from 'tailwindcss/colors';

type Review = {
  message: string;
  author: string;
  numStars: number;
};

type ReviewData = {
  messageKey: string;
  author: string;
  numStars: number;
};

const REVIEW_DATA: ReviewData[] = [
  {
    messageKey: 'emilea',
    author: 'Emilea C.',
    numStars: 5,
  },
  {
    messageKey: 'zlassenp',
    author: 'Zlassenp',
    numStars: 5,
  },
  {
    messageKey: 'rajgha',
    author: 'Rajgha',
    numStars: 4,
  },
  {
    messageKey: 'jaynacc',
    author: 'Jaynacc',
    numStars: 5,
  },
];

const ReviewItem = ({
  message,
  author,
  numStars,
  ...viewProps
}: ViewProps & {
  message: string;
  author: string;
  numStars: number;
}) => {
  return (
    <Card
      className="mx-4 p-4"
      {...viewProps}
    >
      <View className="flex-row items-center gap-2">
        <Text className="text-lg font-bold">{author}</Text>
        <View className="flex-row items-center gap-0.5">
          {Array.from({ length: numStars }).map((_, index) => (
            <Image
              key={index}
              source={IMAGE_ASSETS['star']}
              className="h-4 w-4"
              resizeMode="contain"
            />
          ))}
        </View>
      </View>
      <Text className="mt-1">{message}</Text>
    </Card>
  );
};

type ReviewCarouselKey =
  | 'reviewCarousel.reviews.emilea'
  | 'reviewCarousel.reviews.zlassenp'
  | 'reviewCarousel.reviews.rajgha'
  | 'reviewCarousel.reviews.jaynacc';

export const ReviewCarousel = () => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { isDarkColorScheme } = useColorScheme();
  const progress = useSharedValue<number>(Number(0));
  const ref = useRef<ICarouselInstance>(null);
  const [maxHeight, setMaxHeight] = useState<number>(0);

  const reviews = useMemo(
    () =>
      REVIEW_DATA.map((review) => ({
        ...review,
        message: t(
          `reviewCarousel.reviews.${review.messageKey}` as ReviewCarouselKey
        ),
      })),
    [t]
  );

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View>
      <Carousel
        ref={ref}
        data={reviews}
        renderItem={({ item }) => (
          <ReviewItem
            onLayout={(e) => {
              const height = e.nativeEvent.layout.height;
              setMaxHeight((prev) => Math.max(prev, height));
            }}
            {...item}
          />
        )}
        width={width}
        onProgressChange={progress}
        height={maxHeight + 8}
      />
      <Pagination.Basic
        data={reviews}
        progress={progress}
        dotStyle={{
          width: 8,
          height: 8,
          backgroundColor: isDarkColorScheme
            ? colors.gray[500]
            : colors.gray[300],
          borderRadius: 40,
        }}
        activeDotStyle={{
          width: 8,
          height: 8,
          backgroundColor: isDarkColorScheme ? colors.white : colors.black,
          borderRadius: 40,
        }}
        containerStyle={{
          gap: 4,
        }}
        onPress={onPressPagination}
      />
    </View>
  );
};
