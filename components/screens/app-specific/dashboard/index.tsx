import { MetricCard } from '@/components/core/cards/metric-card';
import { LineChart } from '@/components/core/charts/line-chart';
import { HeaderIconButton } from '@/components/core/header-button';
import { MiniCalendar } from '@/components/core/mini-calendar';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { ProBadge } from '@/components/pro-badge';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { useSafeAreaInsets } from '@/hooks/use-safe-area-insets';
import {
  formatDuration,
  getSeverityColor,
} from '@/lib/app-specific/headache-settings';
import { getDateLocale } from '@/lib/date-locale';
import { useColorScheme } from '@/lib/use-color-scheme';
import { useAsyncStorage } from '@/providers/async-storage-provider';
import { useRecords } from '@/providers/records-provider';
import { useRevenueCat } from '@/providers/revenue-cat-provider';
import type {
  HeadacheRecord,
  HeadacheTrigger,
} from '@/types/app-specific/headache-record';
import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  startOfWeek,
  subWeeks,
} from 'date-fns';
import { useNavigation } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Gauge,
  Hash,
  PlusIcon,
  Zap,
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

iconWithClassName(ChevronLeft);
iconWithClassName(ChevronRight);
iconWithClassName(Hash);
iconWithClassName(Gauge);
iconWithClassName(Clock);
iconWithClassName(PlusIcon);
iconWithClassName(Zap);

function percentChange({
  current,
  previous,
}: {
  current: number | null;
  previous: number | null;
}): number | null {
  if (current == null || previous == null || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

type DayData = {
  date: Date;
  dateId: string;
  severity: number;
  hasData: boolean;
};

type DashboardScreenProps = {
  onAddLog: (params: { selectedDate: string }) => void;
  onPresentPaywall: () => void;
};

export function DashboardScreen({
  onAddLog,
  onPresentPaywall,
}: DashboardScreenProps) {
  const { t, i18n } = useTranslation();
  const { paddingTop, paddingBottom } = useSafeAreaInsets({
    contentPadding: 'bottom',
    nativePadding: 'top',
    additionalBottomPadding: CONFIG.layout.tabBarPadding,
  });
  const { records } = useRecords();
  const { colorScheme } = useColorScheme();
  const { isLoadingCustomerInfo, hasActiveSubscription } = useRevenueCat();
  const { screenshotModeValue: screenshotMode } = useAsyncStorage();
  const navigation = useNavigation();

  const showProBadge =
    !isLoadingCustomerInfo && !hasActiveSubscription && !screenshotMode;

  const dateLocale = getDateLocale(i18n.language);
  const weekStartsOn = dateLocale.options?.weekStartsOn ?? 0;

  // Filter out legacy records without severity
  const validRecords = useMemo(
    () =>
      records.filter(
        (record) => (record as Partial<HeadacheRecord>).severity != null
      ),
    [records]
  );

  const [selectedWeekStart, setSelectedWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn })
  );
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  // Reset week start when locale changes (weekStartsOn may differ)
  useEffect(() => {
    setSelectedWeekStart(startOfWeek(new Date(), { weekStartsOn }));
    setSelectedDayIndex(null);
  }, [weekStartsOn]);

  const goToPreviousWeek = useCallback(() => {
    setSelectedWeekStart((current) => subWeeks(current, 1));
    setSelectedDayIndex(null);
  }, []);

  const goToNextWeek = useCallback(() => {
    setSelectedWeekStart((current) => addWeeks(current, 1));
    setSelectedDayIndex(null);
  }, []);

  const weekLabel = useMemo(() => {
    const weekEnd = endOfWeek(selectedWeekStart, { weekStartsOn });
    const sameMonth =
      selectedWeekStart.getMonth() === weekEnd.getMonth() &&
      selectedWeekStart.getFullYear() === weekEnd.getFullYear();
    const year = format(weekEnd, 'yyyy', { locale: dateLocale });
    if (sameMonth) {
      const startDay = format(selectedWeekStart, 'd', { locale: dateLocale });
      const endDay = format(weekEnd, 'd', { locale: dateLocale });
      const month = format(selectedWeekStart, 'MMM', { locale: dateLocale });
      return { range: `${month} ${startDay}–${endDay}`, year };
    }
    const startStr = format(selectedWeekStart, 'MMM d', { locale: dateLocale });
    const endStr = format(weekEnd, 'MMM d', { locale: dateLocale });
    return { range: `${startStr} – ${endStr}`, year };
  }, [selectedWeekStart, weekStartsOn, dateLocale]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: showProBadge
        ? () => (
            <HeaderIconButton onPress={onPresentPaywall}>
              <ProBadge hideText />
            </HeaderIconButton>
          )
        : undefined,
      headerRight: () => (
        <HeaderIconButton
          onPress={() =>
            onAddLog({ selectedDate: format(new Date(), 'yyyy-MM-dd') })
          }
        >
          <PlusIcon
            size={CONFIG.icon.size.md}
            className="text-foreground"
          />
        </HeaderIconButton>
      ),
      headerTitle: () => (
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={goToPreviousWeek}
            className="p-2 active:opacity-50"
            hitSlop={8}
          >
            <Icon
              as={ChevronLeft}
              size={CONFIG.icon.size.md}
              className="text-foreground"
            />
          </Pressable>
          <View className="items-center">
            <Text className="text-lg font-semibold">{weekLabel.range}</Text>
            <Text className="text-xs text-muted-foreground -mt-1">
              {weekLabel.year}
            </Text>
          </View>
          <Pressable
            onPress={goToNextWeek}
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
    });
  }, [
    navigation,
    weekLabel,
    goToPreviousWeek,
    goToNextWeek,
    showProBadge,
    onPresentPaywall,
    onAddLog,
  ]);

  const getRecordsForWeek = useCallback(
    ({ weekStart }: { weekStart: Date }) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn });
      return validRecords.filter((record) => {
        const recordDate = new Date(record.event);
        return recordDate >= weekStart && recordDate <= weekEnd;
      });
    },
    [weekStartsOn, validRecords]
  );

  const computeStats = useCallback(
    ({ records: recs }: { records: HeadacheRecord[] }) => {
      const count = recs.length;

      const avgSeverity =
        count > 0 ? recs.reduce((sum, r) => sum + r.severity, 0) / count : null;

      const recordsWithDuration = recs.filter((r) => r.duration != null);
      const avgDurationMinutes =
        recordsWithDuration.length > 0
          ? Math.round(
              recordsWithDuration.reduce(
                (sum, r) => sum + (r.duration ?? 0),
                0
              ) / recordsWithDuration.length
            )
          : null;

      const triggerCounts = new Map<HeadacheTrigger, number>();
      for (const record of recs) {
        for (const trigger of record.triggers ?? []) {
          triggerCounts.set(trigger, (triggerCounts.get(trigger) ?? 0) + 1);
        }
      }
      let topTrigger: HeadacheTrigger | null = null;
      let maxCount = 0;
      for (const [trigger, triggerCount] of triggerCounts) {
        if (triggerCount > maxCount) {
          maxCount = triggerCount;
          topTrigger = trigger;
        }
      }

      return { count, avgSeverity, avgDurationMinutes, topTrigger };
    },
    []
  );

  const weekStats = useMemo(
    () =>
      computeStats({
        records: getRecordsForWeek({ weekStart: selectedWeekStart }),
      }),
    [computeStats, getRecordsForWeek, selectedWeekStart]
  );

  const prevWeekStats = useMemo(
    () =>
      computeStats({
        records: getRecordsForWeek({
          weekStart: subWeeks(selectedWeekStart, 1),
        }),
      }),
    [computeStats, getRecordsForWeek, selectedWeekStart]
  );

  const weekData = useMemo<DayData[]>(() => {
    const weekEnd = endOfWeek(selectedWeekStart, { weekStartsOn });
    const days = eachDayOfInterval({ start: selectedWeekStart, end: weekEnd });

    return days.map((day) => {
      const dateId = format(day, 'yyyy-MM-dd');
      const dayRecords = validRecords.filter(
        (record) => format(new Date(record.event), 'yyyy-MM-dd') === dateId
      );
      const maxSeverity =
        dayRecords.length > 0
          ? Math.max(...dayRecords.map((r) => r.severity))
          : 0;

      return {
        date: day,
        dateId,
        severity: maxSeverity,
        hasData: dayRecords.length > 0,
      };
    });
  }, [selectedWeekStart, weekStartsOn, validRecords]);

  const renderIndicator = useCallback(
    ({ index }: { index: number }) => {
      const day = weekData[index];
      if (!day.hasData) return null;
      return (
        <View
          className="h-2 w-2 rounded-full"
          style={{
            backgroundColor: getSeverityColor({
              severity: day.severity,
              colorScheme,
            }),
          }}
        />
      );
    },
    [weekData, colorScheme]
  );

  const renderTooltip = useCallback(
    ({
      index,
    }: {
      dataPoint: { value: number; hasData: boolean };
      index: number;
    }) => {
      const day = weekData[index];

      const dayRecords = validRecords
        .filter(
          (record) =>
            format(new Date(record.event), 'yyyy-MM-dd') === day.dateId
        )
        .sort(
          (a, b) => new Date(a.event).getTime() - new Date(b.event).getTime()
        ) as HeadacheRecord[];

      const shown = dayRecords.slice(0, 3);
      const overflow = dayRecords.length - shown.length;

      return (
        <View className="px-3 py-2.5 gap-1.5">
          {shown.map((record) => (
            <View
              key={record.id}
              className="flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-1.5">
                <View
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: getSeverityColor({
                      severity: record.severity,
                      colorScheme,
                    }),
                  }}
                />
                <Text className="text-sm font-semibold text-foreground">
                  {record.severity}
                  <Text className="text-xs font-normal text-muted-foreground">
                    /10
                  </Text>
                </Text>
              </View>
              <Text className="text-xs font-medium text-foreground">
                {format(new Date(record.event), 'h:mm a')}
              </Text>
            </View>
          ))}
          {overflow > 0 && (
            <Text className="text-xs text-muted-foreground">
              and {overflow} more
            </Text>
          )}
        </View>
      );
    },
    [weekData, validRecords, colorScheme]
  );

  const weekHasNoData = !weekData.some((d) => d.hasData);

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop }}
      testID="dashboard-screen"
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="mx-4 mt-4 rounded-3xl bg-card overflow-hidden"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 0,
          }}
        >
          <MiniCalendar
            days={weekData.map((d) => d.date)}
            selectedDayIndex={selectedDayIndex}
            onSelectDay={({ index }) => setSelectedDayIndex(index)}
            dateLocale={dateLocale}
            renderIndicator={renderIndicator}
            today={new Date()}
          />
          <LineChart
            data={weekData.map((d) => ({
              value: d.severity,
              hasData: d.hasData,
            }))}
            maxValue={10}
            selectedIndex={selectedDayIndex}
            colorScheme={colorScheme}
            dataPointColors={weekData.map((d) =>
              getSeverityColor({ severity: d.severity, colorScheme })
            )}
            renderTooltip={renderTooltip}
            emptyLabel={weekHasNoData ? t('dashboard.noData') : undefined}
          />
        </View>
        <View className="mt-6 gap-2 px-4">
          <View className="flex-row gap-2">
            <MetricCard
              value={weekStats.count > 0 ? String(weekStats.count) : '-'}
              isEmpty={weekHasNoData}
              title={t('dashboard.totalHeadaches')}
              icon={Hash}
              iconColor="blue"
              changePercent={percentChange({
                current: weekStats.count,
                previous: prevWeekStats.count,
              })}
            />
            <MetricCard
              value={
                weekStats.avgSeverity != null
                  ? weekStats.avgSeverity.toFixed(1)
                  : '-'
              }
              suffix="/10"
              isEmpty={weekHasNoData}
              title={t('dashboard.avgSeverity')}
              icon={Gauge}
              iconColor="purple"
              changePercent={percentChange({
                current: weekStats.avgSeverity,
                previous: prevWeekStats.avgSeverity,
              })}
            />
          </View>
          <View className="flex-row gap-2">
            <MetricCard
              value={
                weekStats.avgDurationMinutes != null
                  ? formatDuration({ minutes: weekStats.avgDurationMinutes })
                  : '-'
              }
              isEmpty={weekHasNoData}
              title={t('dashboard.avgDuration')}
              icon={Clock}
              iconColor="teal"
              changePercent={percentChange({
                current: weekStats.avgDurationMinutes,
                previous: prevWeekStats.avgDurationMinutes,
              })}
            />
            <MetricCard
              value={
                weekStats.topTrigger != null
                  ? t(`log.triggerOptions.${weekStats.topTrigger}`)
                  : '-'
              }
              isEmpty={weekHasNoData}
              title={t('dashboard.topTrigger')}
              icon={Zap}
              iconColor="amber"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
