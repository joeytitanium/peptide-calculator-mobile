import { useColorScheme } from '@/lib/use-color-scheme';
import { clsx } from 'clsx';
import { type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

type OnboardingIconBadgeProps = {
  icon: LucideIcon;
  color: string;
  iconSize?: number;
  strokeWidth?: number;
  filled?: boolean;
};

export const OnboardingIconBadge = ({
  icon: Icon,
  color,
  iconSize = 40,
  strokeWidth = 2.5,
  filled = false,
}: OnboardingIconBadgeProps) => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View
      className={clsx('h-24 w-24 items-center justify-center rounded-full', {
        [`bg-${color}-100`]: !isDarkColorScheme,
        [`bg-${color}-950/50`]: isDarkColorScheme,
      })}
    >
      <View
        className={`h-16 w-16 items-center justify-center rounded-full bg-${color}-500`}
      >
        <Icon
          size={iconSize}
          color="white"
          fill={filled ? 'white' : 'none'}
          strokeWidth={strokeWidth}
        />
      </View>
    </View>
  );
};
