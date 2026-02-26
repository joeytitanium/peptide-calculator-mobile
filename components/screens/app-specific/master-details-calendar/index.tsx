import { EmptyState } from '@/components/core/empty-state';
import { HeaderIconButton } from '@/components/core/header-button';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { ProBadge } from '@/components/pro-badge';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { useSafeAreaInsets } from '@/hooks/use-safe-area-insets';
import { getSeverityColor } from '@/lib/app-specific/headache-settings';
import { getDateLocale } from '@/lib/date-locale';
import { useAsyncStorage } from '@/providers/async-storage-provider';
import { useRecords } from '@/providers/records-provider';
import { useRevenueCat } from '@/providers/revenue-cat-provider';
import type { HeadacheRecord } from '@/types/app-specific/headache-record';
import { toDateId, useCalendar } from '@marceloterreiro/flash-calendar';
import { addMonths, format } from 'date-fns';
import { useNavigation } from 'expo-router';
import {
  Brain,
  ChevronLeft,
  ChevronRight,
  PlusIcon,
} from 'lucide-react-native';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import { RecordListItem } from './record-list-item';

iconWithClassName(Brain);
iconWithClassName(ChevronLeft);
iconWithClassName(ChevronRight);
iconWithClassName(PlusIcon);

const today = toDateId(new Date());

type DaySeverity = Partial<Record<string, number>>;

type MasterDetailsCalendarScreenProps = {
  initialDateId?: string;
  onAddLog: (params: { selectedDate: string }) => void;
  onPressRecord: (params: { recordId: string }) => void;
  onPresentPaywall: () => void;
};

export function MasterDetailsCalendarScreen({
  initialDateId = today,
  onAddLog,
  onPressRecord,
  onPresentPaywall,
}: MasterDetailsCalendarScreenProps) {
  const { t, i18n } = useTranslation();
  const { paddingTop, paddingBottom } = useSafeAreaInsets({
    contentPadding: 'bottom',
    nativePadding: 'top',
    additionalBottomPadding: CONFIG.layout.tabBarPadding,
  });
  const { records } = useRecords();
  const { isLoadingCustomerInfo, hasActiveSubscription } = useRevenueCat();
  const { screenshotModeValue: screenshotMode } = useAsyncStorage();

  // Filter out legacy records that don't have severity (old WaterRecord data)
  const validRecords = useMemo(
    () =>
      records.filter(
        (record) => (record as Partial<HeadacheRecord>).severity != null
      ),
    [records]
  );

  const showProBadge =
    !isLoadingCustomerInfo && !hasActiveSubscription && !screenshotMode;
  const [selectedDate, setSelectedDate] = useState(initialDateId);
  const [displayedMonthId, setDisplayedMonthId] = useState(initialDateId);

  // Update selected date when initialDateId changes (e.g., from route params)
  useEffect(() => {
    if (initialDateId) {
      setSelectedDate(initialDateId);
      setDisplayedMonthId(initialDateId);
    }
  }, [initialDateId]);

  const goToPreviousMonth = useCallback(() => {
    setDisplayedMonthId((current) => {
      const currentDate = new Date(current);
      const newDate = addMonths(currentDate, -1);
      return toDateId(newDate);
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setDisplayedMonthId((current) => {
      const currentDate = new Date(current);
      const newDate = addMonths(currentDate, 1);
      return toDateId(newDate);
    });
  }, []);

  const displayedMonthLabel = useMemo(() => {
    return format(new Date(displayedMonthId), 'MMMM yyyy', {
      locale: getDateLocale(i18n.language),
    });
  }, [displayedMonthId, i18n.language]);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: showProBadge
        ? () => (
            <HeaderIconButton onPress={onPresentPaywall}>
              <ProBadge hideText />
            </HeaderIconButton>
          )
        : undefined,
      headerTitle: () => (
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={goToPreviousMonth}
            className="p-2 active:opacity-50"
            hitSlop={8}
            testID="prev-month-button"
          >
            <Icon
              as={ChevronLeft}
              size={CONFIG.icon.size.md}
              className="text-foreground"
            />
          </Pressable>
          <Text className="text-lg font-semibold">{displayedMonthLabel}</Text>
          <Pressable
            onPress={goToNextMonth}
            className="p-2 active:opacity-50"
            hitSlop={8}
          >
            <Icon
              as={ChevronRight}
              size={CONFIG.icon.size.md}
              className="text-foreground"
            />
          </Pressable>
        </View>
      ),
      headerRight: () => (
        <HeaderIconButton
          onPress={() => onAddLog({ selectedDate })}
          testID="add-log-button"
        >
          <PlusIcon
            size={CONFIG.icon.size.md}
            className="text-foreground"
          />
        </HeaderIconButton>
      ),
    });
  }, [
    navigation,
    displayedMonthLabel,
    goToPreviousMonth,
    goToNextMonth,
    onPresentPaywall,
    onAddLog,
    showProBadge,
    selectedDate,
  ]);

  // Filter and sort records for the selected date
  const recordsForSelectedDate = useMemo(() => {
    return validRecords
      .filter(
        (record) =>
          format(new Date(record.event), 'yyyy-MM-dd') === selectedDate
      )
      .sort((a, b) => a.event.localeCompare(b.event));
  }, [validRecords, selectedDate]);

  // Build severity map for each day (worst severity)
  const daySeverity = useMemo<DaySeverity>(() => {
    const severityMap: DaySeverity = {};
    for (const record of validRecords) {
      const dateId = format(new Date(record.event), 'yyyy-MM-dd');
      severityMap[dateId] = Math.max(severityMap[dateId] ?? 0, record.severity);
    }
    return severityMap;
  }, [validRecords]);

  // Use the calendar hook to build custom calendar with dots
  const { weeksList, weekDaysList } = useCalendar({
    calendarMonthId: displayedMonthId,
    calendarActiveDateRanges: [{ startId: selectedDate, endId: selectedDate }],
  });

  const handleRecordPress = (record: HeadacheRecord) => {
    onPressRecord({ recordId: record.id });
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop }}
    >
      {/* Sticky calendar header */}
      <View className="px-4 pb-2 border-b border-border">
        {/* Week day headers */}
        <View className="flex-row mt-2">
          {weekDaysList.map((dayName, idx) => (
            <View
              key={idx}
              className="flex-1 items-center py-2"
            >
              <Text className="text-xs text-muted-foreground font-medium">
                {dayName}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar grid */}
        {weeksList.map((week, weekIndex) => (
          <View
            key={weekIndex}
            className="flex-row"
          >
            {week.map((day) => {
              const isSelected = day.id === selectedDate;
              const isToday = day.isToday;
              const isFuture = day.id > today;
              const isDisabled = day.isDifferentMonth || isFuture;
              const severity = daySeverity[day.id] ?? 0;
              const hasSeverity = severity > 0;

              return (
                <Pressable
                  key={day.id}
                  onPress={() => !isDisabled && setSelectedDate(day.id)}
                  className="flex-1 items-center mt-1"
                >
                  <View
                    key={
                      isSelected ? 'selected' : isToday ? 'today' : 'default'
                    }
                    className={`w-9 h-9 items-center justify-center rounded-full ${
                      isSelected
                        ? 'bg-foreground'
                        : isToday
                          ? 'bg-secondary'
                          : ''
                    }`}
                  >
                    <Text
                      className={`text-lg font-medium ${
                        isDisabled
                          ? 'text-muted-foreground/30'
                          : isSelected
                            ? 'text-background'
                            : ''
                      }`}
                    >
                      {day.displayLabel}
                    </Text>
                  </View>
                  {/* Severity dot */}
                  <View className="h-2 mt-1 items-center justify-center">
                    {!day.isDifferentMonth && hasSeverity && (
                      <View
                        style={{
                          backgroundColor: getSeverityColor({ severity }),
                        }}
                        className="w-2 h-2 rounded-full"
                      />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {/* Scrollable records list */}
      <ScrollView
        contentContainerStyle={{ paddingBottom }}
        showsVerticalScrollIndicator={false}
        className="flex-1 pt-4 pb-2"
      >
        {recordsForSelectedDate.length > 0 ? (
          <View className="px-4 pb-4">
            <View className="bg-card rounded-2xl overflow-hidden">
              {recordsForSelectedDate.map((record, index) => (
                <RecordListItem
                  key={record.id}
                  record={record}
                  onPress={() => handleRecordPress(record)}
                  isLast={index === recordsForSelectedDate.length - 1}
                />
              ))}
            </View>
          </View>
        ) : (
          <EmptyState
            className="flex-1 py-20"
            icon={
              <Icon
                as={Brain}
                size={CONFIG.icon.size['xl']}
                className="text-muted-foreground"
              />
            }
            title={t('calendar.noRecords')}
            description={t('calendar.noRecordsMessage')}
            primaryButton={{
              label: t('calendar.addLog'),
              onPress: () => onAddLog({ selectedDate }),
            }}
          />
        )}
      </ScrollView>
    </View>
  );
}
