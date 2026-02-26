import { GlowIcon, GlowIconColor } from '@/components/core/glow-icon';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useColorScheme } from '@/lib/use-color-scheme';
import type { LucideIcon } from 'lucide-react-native';
import { TrendingDown, TrendingUp } from 'lucide-react-native';
import { View } from 'react-native';

iconWithClassName(TrendingUp);
iconWithClassName(TrendingDown);

type MetricCardProps = {
  title: string;
  value: string;
  suffix?: string;
  icon: LucideIcon;
  iconColor?: GlowIconColor;
  changePercent?: number | null;
  isEmpty?: boolean;
};

export function MetricCard({
  title,
  value,
  suffix,
  icon,
  iconColor = 'blue',
  changePercent,
  isEmpty = false,
}: MetricCardProps) {
  const { isDarkColorScheme } = useColorScheme();
  const hasChange = changePercent != null && isFinite(changePercent);
  const isPositiveChange = hasChange && changePercent > 0;
  const isNegativeChange = hasChange && changePercent < 0;

  return (
    <View className="flex-1 justify-between rounded-3xl bg-card p-3 gap-2">
      <View className="gap-2 px-1 pt-1">
        <GlowIcon icon={icon} color={iconColor} />
        <Text className="text-lg font-bold text-foreground">{title}</Text>
      </View>
      <View className="rounded-xl bg-muted/50 p-3 gap-2">
        {!isEmpty && hasChange ? (
          <View
            className={`self-start flex-row items-center gap-1 rounded-full px-2 py-0.5 ${
              isNegativeChange
                ? isDarkColorScheme
                  ? 'bg-green-950'
                  : 'bg-green-100'
                : isPositiveChange
                  ? isDarkColorScheme
                    ? 'bg-red-950'
                    : 'bg-red-100'
                  : 'bg-muted'
            }`}
          >
            <Icon
              as={isNegativeChange ? TrendingDown : TrendingUp}
              size={12}
              className={
                isNegativeChange
                  ? 'text-green-600 dark:text-green-400'
                  : isPositiveChange
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-muted-foreground'
              }
            />
            <Text
              className={`text-xs font-medium ${
                isNegativeChange
                  ? 'text-green-600 dark:text-green-400'
                  : isPositiveChange
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-muted-foreground'
              }`}
            >
              {Math.abs(changePercent).toFixed(1)}%
            </Text>
          </View>
        ) : (
          <View className="h-5" />
        )}
        <Text
          className={`text-3xl font-bold ${isEmpty ? 'text-muted-foreground/40' : 'text-foreground'}`}
        >
          {value}
          {suffix ? (
            <Text className="text-lg font-medium text-muted-foreground">
              {suffix}
            </Text>
          ) : null}
        </Text>
      </View>
    </View>
  );
}
