import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { useColorScheme } from '@/lib/use-color-scheme';
import { GlassView } from 'expo-glass-effect';
import { Check, X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import colors from 'tailwindcss/colors';
import { IMAGE_ASSETS } from './assets';
import { Button } from './ui/button';

iconWithClassName(Check);
iconWithClassName(X);

type SlideContent = {
  type: 'content';
  titleKey: string;
  images: number[];
  bulletKeys: string[];
  variant: 'good' | 'bad';
};

type SummarySlideContent = {
  type: 'summary';
};

type SlideData = SlideContent | SummarySlideContent;

const CONTENT_SLIDES: SlideContent[] = [
  {
    type: 'content',
    variant: 'good',
    titleKey: 'photoGuidelines.photoRequirements',
    images: [
      IMAGE_ASSETS['photo-guidelines-good-1'],
      IMAGE_ASSETS['photo-guidelines-good-2'],
      IMAGE_ASSETS['photo-guidelines-good-3'],
    ],
    bulletKeys: [
      'photoGuidelines.bullets.ensureBothLines',
      'photoGuidelines.bullets.testStraight',
      'photoGuidelines.bullets.clearPhoto',
      'photoGuidelines.bullets.simpleBackground',
    ],
  },
  {
    type: 'content',
    variant: 'bad',
    titleKey: 'photoGuidelines.whatToAvoid',
    images: [
      IMAGE_ASSETS['photo-guidelines-bad-1'],
      IMAGE_ASSETS['photo-guidelines-bad-2'],
      IMAGE_ASSETS['photo-guidelines-bad-3'],
    ],
    bulletKeys: [
      'photoGuidelines.bullets.avoidBlurry',
      'photoGuidelines.bullets.dontCrop',
      'photoGuidelines.bullets.avoidShadows',
      'photoGuidelines.bullets.dontAngle',
      'photoGuidelines.bullets.darkPhotos',
    ],
  },
];

const ALL_SLIDES: SlideData[] = [...CONTENT_SLIDES, { type: 'summary' }];

const ExampleImage = ({
  source,
  variant,
}: {
  source: number;
  variant: 'good' | 'bad';
}) => (
  <View className="relative flex-1 aspect-square">
    <Image
      source={source}
      className="h-full w-full rounded-lg"
      resizeMode="cover"
    />
    <View
      className={`absolute bottom-1 right-1 h-5 w-5 items-center justify-center rounded-full ${
        variant === 'good' ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      {variant === 'good' ? (
        <Check
          size={12}
          color="white"
          strokeWidth={3}
        />
      ) : (
        <X
          size={12}
          color="white"
          strokeWidth={3}
        />
      )}
    </View>
  </View>
);

const ContentSlide = ({
  content,
  t,
}: {
  content: SlideContent;

  t: (key: any) => string;
}) => (
  <ScrollView
    className="flex-1 px-6"
    showsVerticalScrollIndicator={false}
  >
    <Text className="mb-4 text-xl font-semibold">{t(content.titleKey)}</Text>

    <View className="mb-5 flex-row gap-2">
      {content.images.map((image, index) => (
        <ExampleImage
          key={index}
          source={image}
          variant={content.variant}
        />
      ))}
    </View>

    <View className="gap-3">
      {content.bulletKeys.map((bulletKey, index) => (
        <View
          key={index}
          className="flex-row items-start gap-2"
        >
          <Check
            size={18}
            className={`text-${CONFIG.tintColor.base}-400`}
            strokeWidth={2}
          />
          <Text className="flex-1 text-sm leading-relaxed">{t(bulletKey)}</Text>
        </View>
      ))}
    </View>
  </ScrollView>
);

const SummarySlide = ({ t }: { t: (key: any) => string }) => (
  <ScrollView
    className="flex-1 px-6"
    showsVerticalScrollIndicator={false}
  >
    <Text className="mb-4 text-xl font-semibold">
      {t('photoGuidelines.summary.title')}
    </Text>
    <Text className="mb-4 text-sm leading-relaxed">
      {t('photoGuidelines.summary.intro')}
    </Text>
    <Text className="mb-4 text-sm leading-relaxed">
      {t('photoGuidelines.summary.evapLines')}
      {t('photoGuidelines.summary.evapDesc')}
    </Text>
    <Text className="mb-4 text-sm leading-relaxed">
      {t('photoGuidelines.summary.indentLines')}
      {t('photoGuidelines.summary.indentDesc')}
    </Text>
    <Text className="text-sm leading-relaxed">
      {t('photoGuidelines.summary.revisitGuide')}
    </Text>
  </ScrollView>
);

type PhotoGuidelinesProps = {
  onComplete: () => void;
  visible?: boolean;
};

export const PhotoGuidelines = ({
  onComplete,
  visible = true,
}: PhotoGuidelinesProps) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { isDarkColorScheme } = useColorScheme();
  const carouselRef = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = ALL_SLIDES.length;
  const cardWidth = width - 32; // full width with px-4 margins

  if (!visible) {
    return null;
  }

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      carouselRef.current?.next();
    } else {
      onComplete();
    }
  };

  const onPressPagination = (index: number) => {
    carouselRef.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const isLastSlide = currentSlide === totalSlides - 1;
  const buttonText = isLastSlide
    ? t('onboarding.button.continue')
    : t('photoGuidelines.next');

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Card
        className="overflow-hidden"
        style={{ width: cardWidth }}
      >
        <View className="pt-1">
          <Carousel
            ref={carouselRef}
            data={ALL_SLIDES}
            renderItem={({ item }) =>
              item.type === 'summary' ? (
                <SummarySlide t={t} />
              ) : (
                <ContentSlide
                  content={item}
                  t={t}
                />
              )
            }
            width={cardWidth - 2} // account for border
            height={420}
            onProgressChange={progress}
            onSnapToItem={setCurrentSlide}
            loop={false}
          />
        </View>

        <CardContent className="gap-4 pt-4">
          <View className="">
            <Pagination.Basic
              data={ALL_SLIDES}
              progress={progress}
              dotStyle={{
                width: 8,
                height: 8,
                backgroundColor: isDarkColorScheme
                  ? colors.gray[600]
                  : colors.gray[300],
                borderRadius: 40,
              }}
              activeDotStyle={{
                width: 8,
                height: 8,
                backgroundColor: `${colors.blue[500]}`,
                borderRadius: 40,
              }}
              containerStyle={{
                gap: 6,
                justifyContent: 'center',
              }}
              onPress={onPressPagination}
            />
          </View>

          <Button onPress={handleNext}>
            <Text className="text-base font-semibold">{buttonText}</Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
};

type PhotoGuidelinesModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const PhotoGuidelinesModal = ({
  visible,
  onClose,
}: PhotoGuidelinesModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background">
        <GlassView
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 16,
            marginTop: 16,
          }}
        >
          <Pressable onPress={onClose}>
            <X
              size={24}
              className="text-foreground"
              strokeWidth={2}
            />
          </Pressable>
        </GlassView>
        <PhotoGuidelines onComplete={onClose} />
      </View>
    </Modal>
  );
};
