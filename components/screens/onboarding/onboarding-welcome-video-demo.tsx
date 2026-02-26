import { SlideUpRevealView } from '@/components/core/animations/slide-up-reveal-view';
import { HeaderIconButton } from '@/components/core/header-button';
import { LocalVideoView } from '@/components/core/local-video-view';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Onboarding } from '@/components/onboarding/components';
import { CONFIG } from '@/config';
import { useColorScheme } from '@/lib/use-color-scheme';
import { Href, useNavigation, useRouter } from 'expo-router';
import { Zap } from 'lucide-react-native';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import colors from 'tailwindcss/colors';

iconWithClassName(Zap);

const VIDEO_RATIO = 997 / 557;
const IPHONE_THRESHOLD_WIDTH = 400;

export const OnboardingWelcomeVideoDemo = ({
  currentHref,
  onPresentPaywall,
}: {
  currentHref: Href;
  onPresentPaywall: () => void;
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { isDarkColorScheme } = useColorScheme();

  useEffect(() => {
    if (!__DEV__) {
      return;
    }

    navigation.setOptions({
      headerRight: () => (
        <HeaderIconButton onPress={onPresentPaywall}>
          <Zap
            size={CONFIG.icon.size.sm}
            className="text-foreground ml-[8px]"
          />
        </HeaderIconButton>
      ),
    });
  }, [navigation, router, onPresentPaywall]);

  return (
    <Onboarding.Container
      currentHref={currentHref}
      progressBarHidden
      canProceed
      topGradientHidden
      bottomGradientHidden
    >
      {({ top, bottomToolbarHeight, bottom }) => (
        <>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              paddingTop: top + 60,
            }}
          >
            <LocalVideoView
              assetName="demo"
              width={width}
              height={height}
              style={{
                width:
                  width > IPHONE_THRESHOLD_WIDTH ? width * 0.6 : width * 0.55,
                height:
                  width > IPHONE_THRESHOLD_WIDTH
                    ? width * 0.6 * VIDEO_RATIO
                    : width * 0.55 * VIDEO_RATIO,
                borderRadius: 32,
                borderColor: isDarkColorScheme
                  ? colors.white
                  : colors.gray[400],
                borderWidth: 4,
              }}
            />
          </ScrollView>
          <View
            className="absolute left-0 right-0 items-center"
            style={{
              bottom: bottomToolbarHeight + bottom + 8,
            }}
          >
            <Onboarding.TextContainer>
              <SlideUpRevealView
                delay={300}
                className="mb-2"
              >
                <Onboarding.JumbleTitle>
                  {t('videoDemo.title')}
                </Onboarding.JumbleTitle>
                <Onboarding.Subtitle className="mt-2">
                  {t('videoDemo.subtitle')}
                </Onboarding.Subtitle>
              </SlideUpRevealView>
            </Onboarding.TextContainer>
          </View>
        </>
      )}
    </Onboarding.Container>
  );
};
