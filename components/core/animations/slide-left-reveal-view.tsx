import { ReactNode, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

export const SlideLeftRevealView = ({
  children,
  className,
  delay = 300,
  duration = 800,
  shouldAnimate = Platform.OS !== 'android',
  translateX: parentTranslateX = -30,
  onAnimationStart,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  translateX?: number;
  shouldAnimate?: boolean;
  onAnimationStart?: () => void;
}) => {
  const opacity = useSharedValue(shouldAnimate ? 0 : 1);
  const translateX = useSharedValue(shouldAnimate ? parentTranslateX : 0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateX: translateX.value }],
    };
  });

  const startAnimation = useCallback(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration }, (finished) => {
        'worklet';
        if (finished && onAnimationStart) {
          runOnJS(onAnimationStart)();
        }
      })
    );
    translateX.value = withDelay(delay, withTiming(0, { duration }));
  }, [delay, duration, onAnimationStart, opacity, translateX]);

  const skipAnimation = useCallback(() => {
    cancelAnimation(opacity);
    cancelAnimation(translateX);
    opacity.value = 1;
    translateX.value = 0;
  }, [opacity, translateX]);

  useEffect(() => {
    if (shouldAnimate) {
      startAnimation();
    } else {
      skipAnimation();
    }
  }, [shouldAnimate, delay, duration, startAnimation, skipAnimation]);

  return (
    <Animated.View
      style={animatedStyle}
      className={className}
    >
      {children}
    </Animated.View>
  );
};
