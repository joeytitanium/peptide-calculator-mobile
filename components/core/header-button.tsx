import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { clsx } from 'clsx';
import { X } from 'lucide-react-native';
import { forwardRef, ReactNode } from 'react';
import { ActivityIndicator, Platform, Pressable, View } from 'react-native';

const HIT_SLOP = 44;

export const HeaderIconButton = forwardRef<
  View,
  {
    onPress: () => void;
    disabled?: boolean;
    children: ReactNode;
    testID?: string;
  }
>(function HeaderIconButton({ onPress, disabled, children, testID }, ref) {
  return (
    <Pressable
      ref={ref}
      onPress={onPress}
      testID={testID}
      accessible={!!testID}
      accessibilityLabel={testID}
      className={clsx('items-center justify-center', {
        'p-[6px]': Platform.OS === 'ios',
        'p-[10px] bg-card rounded-full active:bg-accent dark:active:bg-accent/50':
          Platform.OS === 'android',
      })}
      disabled={disabled}
      hitSlop={HIT_SLOP}
    >
      {children}
    </Pressable>
  );
});

export const HeaderCloseButton = ({
  onPress,
  disabled,
}: {
  onPress: () => void;
  disabled?: boolean;
}) => {
  return (
    <HeaderIconButton
      onPress={onPress}
      disabled={disabled}
      testID="header-close-button"
    >
      <X
        size={CONFIG.icon.size.md}
        className="text-foreground"
      />
    </HeaderIconButton>
  );
};

export const HeaderSubmitButton = ({
  onPress,
  disabled,
  title,
  titleClassName,
  loading,
  buttonClassName,
  icon,
}: {
  onPress: () => void;
  disabled?: boolean;
  title: string;
  titleClassName?: string;
  buttonClassName?: string;
  loading: boolean;
  icon?: ReactNode;
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      hitSlop={HIT_SLOP}
      className={clsx(
        'flex-row items-center gap-2 rounded-full',
        {
          'px-3 py-1.5': Platform.OS === 'ios',
          'px-4 py-2 bg-background rounded-full active:bg-accent dark:active:bg-accent/50':
            Platform.OS === 'android',
        },
        buttonClassName
      )}
      style={{ alignSelf: 'center' }}
    >
      <Text
        className={clsx('font-semibold', titleClassName, {
          'opacity-50': loading || disabled,
        })}
      >
        {title}
      </Text>
      {loading ? (
        <ActivityIndicator
          color={CONFIG.tintColor.hex}
          size={CONFIG.icon.size.sm}
        />
      ) : (
        icon
      )}
    </Pressable>
  );
};
