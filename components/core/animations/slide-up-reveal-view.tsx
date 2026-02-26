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

export const SlideUpRevealView = ({
  children,
  className,
  delay = 300,
  duration = 800,
  shouldAnimate = Platform.OS !== 'android',
  translateY: parentTranslateY = 20,
  onAnimationStart,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  translateY?: number;
  shouldAnimate?: boolean;
  onAnimationStart?: () => void;
}) => {
  const opacity = useSharedValue(shouldAnimate ? 0 : 1);
  const translateY = useSharedValue(shouldAnimate ? parentTranslateY : 0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
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
    translateY.value = withDelay(delay, withTiming(0, { duration }));
  }, [delay, duration, onAnimationStart, opacity, translateY]);

  const skipAnimation = useCallback(() => {
    cancelAnimation(opacity);
    cancelAnimation(translateY);
    opacity.value = 1;
    translateY.value = 0;
  }, [opacity, translateY]);

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
