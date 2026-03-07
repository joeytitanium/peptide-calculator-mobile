import { cn } from '@/lib/utils';
import { THEME } from '@/lib/theme';
import { useColorScheme } from '@/lib/use-color-scheme';
import { cva, type VariantProps } from 'class-variance-authority';
import * as Haptics from 'expo-haptics';
import { Star } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import colors from 'tailwindcss/colors';

const starRatingVariants = cva('flex-row items-center', {
  variants: {
    size: {
      sm: 'gap-1',
      md: 'gap-2',
      lg: 'gap-3',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const starSizeMap = {
  sm: 20,
  md: 28,
  lg: 36,
} as const;

type StarRatingProps = VariantProps<typeof starRatingVariants> & {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  className?: string;
};

export function StarRating({
  value,
  onChange,
  size = 'md',
  readonly = false,
  className,
}: StarRatingProps) {
  const { colors: themeColors, isDarkColorScheme } = useColorScheme();
  const emptyStarFill = isDarkColorScheme ? THEME.dark.card : THEME.light.card;

  const stars = Array.from({ length: 5 }, (_, i) => {
    const starValue = i + 1;
    const isFilled = starValue <= value;
    return { starValue, isFilled };
  });

  const handleStarPress = (starValue: number) => {
    if (readonly || !onChange) return;
    void Haptics.selectionAsync();
    onChange(starValue);
  };

  const starSize = starSizeMap[size ?? 'md'];

  return (
    <View className={cn(starRatingVariants({ size }), className)}>
      {stars.map(({ starValue, isFilled }) => {
        const isInteractive = !readonly && onChange;

        return isInteractive ? (
          <Pressable
            key={starValue}
            onPress={() => handleStarPress(starValue)}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Star
              size={starSize}
              color={isFilled ? colors.yellow['400'] : themeColors.grey2}
              fill={isFilled ? colors.yellow['400'] : emptyStarFill}
              strokeWidth={1.5}
            />
          </Pressable>
        ) : (
          <Star
            key={starValue}
            size={starSize}
            color={isFilled ? colors.yellow['400'] : themeColors.grey2}
            fill={isFilled ? colors.yellow['400'] : emptyStarFill}
            strokeWidth={1.5}
          />
        );
      })}
    </View>
  );
}

export type { StarRatingProps };
