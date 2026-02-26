import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { THEME } from '@/lib/theme';
import { useColorScheme } from '@/lib/use-color-scheme';

import type { Locale } from 'date-fns';
import { format } from 'date-fns';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

type MiniCalendarProps = {
  days: Date[];
  selectedDayIndex: number | null;
  onSelectDay: (params: { index: number }) => void;
  dateLocale: Locale;
  renderIndicator?: (params: { date: Date; index: number }) => ReactNode;
  today?: Date;
};

export function MiniCalendar({
  days,
  selectedDayIndex,
  onSelectDay,
  dateLocale,
  renderIndicator,
  today,
}: MiniCalendarProps) {
  const { colorScheme } = useColorScheme();
  const todayId = today ? format(today, 'yyyy-MM-dd') : null;
  const tintColor = CONFIG.tintColor.hex;
  const primaryColor =
    colorScheme === 'dark' ? THEME.dark.primary : THEME.light.primary;

  return (
    <View className="flex-row justify-around px-4 pt-4 pb-2">
      {days.map((date, index) => {
        const dateId = format(date, 'yyyy-MM-dd');
        const isSelected = selectedDayIndex === index;
        const isToday = todayId != null && dateId === todayId;
        const isFuture = todayId != null && dateId > todayId;
        const dayLabel = format(date, 'EEE', { locale: dateLocale });
        const dateNumber = format(date, 'd');

        return (
          <Pressable
            key={dateId}
            onPress={() => onSelectDay({ index })}
            className={`items-center gap-1${isFuture ? ' opacity-35' : ''}`}
            disabled={isFuture}
          >
            <Text
              className={`text-xs ${
                isSelected
                  ? 'font-semibold text-foreground'
                  : 'text-muted-foreground'
              }${isToday && !isSelected ? ' font-semibold' : ''}`}
              style={isToday && !isSelected ? { color: tintColor } : undefined}
            >
              {dayLabel}
            </Text>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isSelected
                  ? isToday
                    ? tintColor
                    : primaryColor
                  : undefined,
                overflow: 'hidden',
              }}
            >
              <Text
                className={`text-lg font-medium ${
                  isSelected ? 'text-background' : 'text-foreground'
                }`}
                style={
                  isToday && !isSelected ? { color: tintColor } : undefined
                }
              >
                {dateNumber}
              </Text>
            </View>
            {renderIndicator?.({ date, index })}
          </Pressable>
        );
      })}
    </View>
  );
}
