import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { getNextHref, ONBOARDING_CONFIG } from '@/lib/onboarding';
import { useColorScheme } from '@/lib/use-color-scheme';
import {
  capturePosthogEvent,
  formatViewedScreenEventName,
} from '@/utils/posthog';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useFocusEffect, useRouter } from 'expo-router';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from 'tailwindcss/colors';
import { OnboardingProgressToolbar } from './progress-toolbar';

type LayoutValues = {
  top: number;
  bottom: number;
  bottomToolbarHeight: number;
  topToolbarHeight: number;
};

export const OnboardingContainer = ({
  topGradientHidden = false,
  bottomGradientHidden = false,
  children,
  progressBarHidden = false,
  currentHref,
  canProceed,
  onProceed,
  onSkip,
  buttonText,
}: {
  topGradientHidden?: boolean;
  bottomGradientHidden?: boolean;
  progressBarHidden?: boolean;
  children: ReactNode | ((layoutValues: LayoutValues) => ReactNode);
  currentHref: Href;
  canProceed: boolean;
  onProceed?: () => void | Promise<void>;
  onSkip?: () => void | Promise<void>;
  buttonText?: string;
}) => {
  const { t } = useTranslation();
  const { top, bottom } = useSafeAreaInsets();
  const [topToolbarHeight, setTopToolbarHeight] = useState<number>(0);
  const [bottomToolbarHeight, setBottomToolbarHeight] = useState<number>(0);
  const { isDarkColorScheme } = useColorScheme();
  const router = useRouter();
  const nextHref = getNextHref(currentHref);

  useFocusEffect(
    useCallback(() => {
      const config = ONBOARDING_CONFIG.find(
        (config) => config.href === currentHref
      );
      if (!config) {
        return;
      }
      capturePosthogEvent(formatViewedScreenEventName(config.posthogEventName));
    }, [currentHref])
  );

  const currentIndex = ONBOARDING_CONFIG.findIndex(
    (config) => config.href === currentHref
  );
  const currentProgress = Math.ceil(
    (currentIndex / (ONBOARDING_CONFIG.length - 1)) * 100
  );

  const layoutValues: LayoutValues = useMemo(
    () => ({
      top,
      topToolbarHeight,
      bottom,
      bottomToolbarHeight,
    }),
    [topToolbarHeight, bottomToolbarHeight, top, bottom]
  );

  const actualButtonText = (() => {
    if (buttonText) {
      return buttonText;
    }
    if (currentIndex === 0) {
      return t('onboarding.button.getStarted');
    }
    return t('onboarding.button.next');
  })();

  return (
    <>
      <View className="flex-1 bg-background">
        {typeof children === 'function' ? children(layoutValues) : children}
      </View>
      {!topGradientHidden && (
        <LinearGradient
          pointerEvents="none"
          colors={
            isDarkColorScheme
              ? [colors.black, colors.transparent]
              : [colors.gray[100], 'rgba(243,244,246,0)']
          }
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 120,
            zIndex: 0,
          }}
        />
      )}
      {!progressBarHidden && (
        <View
          className="absolute left-0 right-0"
          style={{ top: top }}
          onLayout={(event) => {
            setTopToolbarHeight(event.nativeEvent.layout.height);
          }}
        >
          <OnboardingProgressToolbar
            onGoBack={() => router.back()}
            progress={currentProgress}
          />
        </View>
      )}
      {!bottomGradientHidden && (
        <LinearGradient
          pointerEvents="none"
          colors={
            isDarkColorScheme
              ? [colors.transparent, colors.black]
              : ['rgba(243,244,246,0)', colors.gray[100]]
          }
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 200,
            zIndex: 0,
          }}
        />
      )}
      <View
        className="absolute left-0 right-0 justify-between gap-2 py-2 mx-3"
        style={{
          bottom: bottom,
        }}
        onLayout={(event) => {
          setBottomToolbarHeight(event.nativeEvent.layout.height);
        }}
      >
        <Button
          size="lg"
          disabled={!canProceed}
          onPress={async () => {
            if (!canProceed) {
              return;
            }
            if (onProceed) {
              await onProceed();
            }
            if (nextHref) {
              router.push(nextHref);
            }

            const config = ONBOARDING_CONFIG.find(
              (config) => config.href === currentHref
            );
            await config?.onComplete?.();
          }}
        >
          <Text>{actualButtonText}</Text>
        </Button>
        {onSkip && (
          <Button
            variant="outline"
            size="lg"
            onPress={async () => {
              await onSkip();
              if (nextHref) {
                router.push(nextHref);
              }

              const config = ONBOARDING_CONFIG.find(
                (config) => config.href === currentHref
              );
              await config?.onComplete?.();
            }}
          >
            <Text className="text-base text-muted-foreground">
              {t('onboarding.button.skip')}
            </Text>
          </Button>
        )}
      </View>
    </>
  );
};
