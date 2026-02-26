import { Gauge } from '@/components/core/gauge';
import { GlassView } from '@/components/core/glass-view';
import {
  HeaderCloseButton,
  HeaderSubmitButton,
} from '@/components/core/header-button';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useSafeAreaInsets } from '@/hooks/use-safe-area-insets';
import {
  formatDuration,
  getSeverityBgColor,
  getSeverityColor,
  getSeverityLabel,
} from '@/lib/app-specific/headache-settings';
import { useColorScheme } from '@/lib/use-color-scheme';
import { useRecords } from '@/providers/records-provider';
import { format } from 'date-fns';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, View } from 'react-native';

type RecordDetailScreenProps = {
  recordId: string;
  onClose: () => void;
  onEdit: () => void;
};

export function RecordDetailScreen({
  recordId,
  onClose,
  onEdit,
}: RecordDetailScreenProps) {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const { getRecordById, deleteRecordId } = useRecords();
  const { paddingBottom } = useSafeAreaInsets();
  const navigation = useNavigation();

  const record = getRecordById({ id: recordId });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: t('log.logDetails'),
      headerLeft: () => <HeaderCloseButton onPress={onClose} />,
      headerRight: () => (
        <HeaderSubmitButton
          onPress={onEdit}
          title={t('common.edit')}
          loading={false}
        />
      ),
    });
  }, [navigation, onClose, onEdit, t]);

  if (!record) {
    return null;
  }

  const dateFormatted = format(new Date(record.event), 'EEEE, MMMM d, yyyy');
  const timeFormatted = format(new Date(record.event), 'h:mm a');
  const severityColor = getSeverityColor({
    severity: record.severity,
    colorScheme,
  });
  const severityBgColor = getSeverityBgColor({
    severity: record.severity,
    colorScheme,
  });

  const handleDelete = () => {
    Alert.alert(t('log.deleteLogTitle'), t('log.deleteLogMessage'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteRecordId({ id: record.id });
          onClose();
        },
      },
    ]);
  };

  return (
    <ScrollView
      className="bg-background"
      contentContainerStyle={{ paddingBottom }}
      contentContainerClassName="p-4 gap-6"
    >
      {/* Severity Gauge */}
      <View className="items-center gap-3">
        <Gauge
          value={record.severity}
          color={severityColor}
          bgColor={severityBgColor}
          size={96}
          strokeWidth={8}
        />
        <Text
          style={{ color: severityColor }}
          className="text-xl font-bold"
        >
          {t(
            `log.severityLevels.${getSeverityLabel({ severity: record.severity })}`
          )}
        </Text>
      </View>

      {/* Details */}
      <GlassView className="rounded-2xl overflow-hidden">
        <DetailRow
          label={t('log.date')}
          value={dateFormatted}
        />
        <DetailRow
          label={t('log.time')}
          value={timeFormatted}
        />
        <DetailRow
          label={t('log.severity')}
          value={`${record.severity}/10`}
        />
        {record.headacheType && (
          <DetailRow
            label={t('log.headacheType')}
            value={t(`log.headacheTypes.${record.headacheType}`)}
          />
        )}
        {record.location && (
          <DetailRow
            label={t('log.location')}
            value={t(`log.locations.${record.location}`)}
          />
        )}
        {record.duration != null && (
          <DetailRow
            label={t('log.duration')}
            value={formatDuration({ minutes: record.duration })}
          />
        )}
        {record.triggers && record.triggers.length > 0 && (
          <DetailRow
            label={t('log.triggers')}
            value={record.triggers
              .map((trigger) => t(`log.triggerOptions.${trigger}`))
              .join(', ')}
          />
        )}
        {record.medications && record.medications.length > 0 && (
          <DetailRow
            label={t('log.medications')}
            value={record.medications
              .map((med) => t(`log.medicationOptions.${med}`))
              .join(', ')}
          />
        )}
        {record.notes && (
          <DetailRow
            label={t('log.notes')}
            value={record.notes}
            isLast
          />
        )}
        {!record.notes && <View />}
      </GlassView>

      {/* Delete Button */}
      <Button
        variant="ghost"
        onPress={handleDelete}
      >
        <Text className="text-destructive font-medium">
          {t('log.deleteLog')}
        </Text>
      </Button>
    </ScrollView>
  );
}

function DetailRow({
  label,
  value,
  trailing,
  isLast,
}: {
  label: string;
  value: string;
  trailing?: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <View
      className={`flex-row items-start justify-between px-4 py-3 ${
        !isLast ? 'border-b border-border' : ''
      }`}
    >
      <Text className="text-base text-muted-foreground">{label}</Text>
      <View className="flex-row items-center gap-2 flex-shrink ml-4">
        <Text className="text-base font-medium text-right">{value}</Text>
        {trailing}
      </View>
    </View>
  );
}
