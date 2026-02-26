import { clsx } from 'clsx';
import {
  GlassView as ExpoGlassView,
  GlassViewProps as ExpoGlassViewProps,
} from 'expo-glass-effect';
import { ReactNode } from 'react';
import { Platform, Pressable, View } from 'react-native';

export const GlassView = ({
  children,
  className,
  ...glassViewProps
}: ExpoGlassViewProps & {
  children: ReactNode;
}) => {
  return (
    <View className={className}>
      {/* Note: On the calendar view. Expo Glassview can handle class names.  */}
      <ExpoGlassView
        className="bg-card"
        {...glassViewProps}
      >
        {children}
      </ExpoGlassView>
    </View>
  );
};

export const PressableGlassView = ({
  children,
  onPress,
  pressableClassName,
  ...glassViewProps
}: ExpoGlassViewProps & {
  onPress: () => void;
  children: ReactNode;
  pressableClassName?: string;
}) => {
  return (
    <Pressable
      hitSlop={44}
      onPress={onPress}
      className={clsx(pressableClassName, {
        'active:bg-accent dark:active:bg-accent/50 blur-xl':
          Platform.OS === 'android',
      })}
    >
      <GlassView {...glassViewProps}>{children}</GlassView>
    </Pressable>
  );
};
