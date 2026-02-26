import { Gauge } from '@/components/core/gauge';
import { Text } from '@/components/ui/text';
import {
  formatDuration,
  getSeverityBgColor,
  getSeverityColor,
} from '@/lib/app-specific/headache-settings';
import { useColorScheme } from '@/lib/use-color-scheme';
import type { HeadacheRecord } from '@/types/app-specific/headache-record';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

type RecordListItemProps = {
  record: HeadacheRecord;
  onPress?: () => void;
  isLast?: boolean;
};

export const RecordListItem = ({
  record,
  onPress,
  isLast,
}: RecordListItemProps) => {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const time = format(new Date(record.event), 'h:mm a');
  const color = getSeverityColor({ severity: record.severity, colorScheme });
  const bgColor = getSeverityBgColor({
    severity: record.severity,
    colorScheme,
  });

  const details = [
    record.location ? t(`log.locations.${record.location}`) : null,
    record.duration ? formatDuration({ minutes: record.duration }) : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Pressable
      onPress={onPress}
      testID="record-list-item"
    >
      {({ pressed }) => (
        <View
          className={clsx('flex-row items-center gap-3 px-4', {
            'bg-secondary-foreground/10': pressed,
          })}
        >
          <Gauge
            value={record.severity}
            color={color}
            bgColor={bgColor}
          />
          <View
            className={clsx('flex-1 py-4', {
              'border-b border-border': !isLast,
            })}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-semibold text-foreground">
                {record.headacheType
                  ? t(`log.headacheTypes.${record.headacheType}`)
                  : t('log.severityValue', { value: record.severity })}
              </Text>
              <Text className="text-sm text-muted-foreground">{time}</Text>
            </View>
            {details.length > 0 && (
              <Text className="text-sm text-foreground mt-0.5">{details}</Text>
            )}
            {record.notes && (
              <Text
                className="text-sm text-muted-foreground mt-0.5"
                numberOfLines={1}
              >
                {record.notes}
              </Text>
            )}
          </View>
        </View>
      )}
    </Pressable>
  );
};
