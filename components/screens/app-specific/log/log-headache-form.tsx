import { DateTimePicker } from '@/components/core/date-time-picker';
import {
  InputContainer,
  InputDescription,
  InputLabel,
} from '@/components/core/input-primitives';
import { NumberStepper } from '@/components/core/number-stepper';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { useDeterministicallyRequestReview } from '@/hooks/use-deterministically-request-review';
import { useSafeAreaInsets } from '@/hooks/use-safe-area-insets';
import { useRecords } from '@/providers/records-provider';
import { useRevenueCat } from '@/providers/revenue-cat-provider';
import {
  HEADACHE_LOCATIONS,
  HEADACHE_MEDICATIONS,
  HEADACHE_TRIGGERS,
  type HeadacheLocation,
  type HeadacheMedication,
  type HeadacheRecord,
  type HeadacheTrigger,
} from '@/types/app-specific/headache-record';
import { HEADACHE_TYPES, type HeadacheType } from '@/utils/async-storage';
import { format, startOfMonth } from 'date-fns';
import { Clock } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import uuid from 'react-native-uuid';

iconWithClassName(Clock);

type LogHeadacheFormProps = {
  initialRecord?: HeadacheRecord;
  initialDate?: string;
  onSubmit?: (params: { date: Date; severity: number }) => void;
  onPresentPaywall?: () => void;
  onNavigateHome?: (params: { date: string }) => void;
};

export const LogHeadacheForm = ({
  initialRecord,
  initialDate,
  onSubmit,
  onPresentPaywall,
  onNavigateHome,
}: LogHeadacheFormProps) => {
  const { t } = useTranslation();
  const { paddingTop, paddingBottom } = useSafeAreaInsets({
    nativePadding: 'none',
    navigationBarPadding: 'none',
  });
  const { records, createRecord, updateRecord } = useRecords();
  const { hasActiveSubscription } = useRevenueCat();
  const { requestReview } = useDeterministicallyRequestReview();
  const isEditMode = !!initialRecord;

  // Count logs in current month (for monthly limit)
  const monthlyLogCount = useMemo(() => {
    const monthStart = startOfMonth(new Date());
    return records.filter((record) => new Date(record.event) >= monthStart)
      .length;
  }, [records]);

  const FREE_MONTHLY_LOG_LIMIT = 3;
  const isLimitReached =
    !isEditMode &&
    !hasActiveSubscription &&
    monthlyLogCount >= FREE_MONTHLY_LOG_LIMIT;

  const [date, setDate] = useState(
    initialRecord
      ? new Date(initialRecord.event)
      : initialDate
        ? new Date(`${initialDate}T${format(new Date(), 'HH:mm:ss')}`)
        : new Date()
  );

  const [severity, setSeverity] = useState<number>(
    initialRecord?.severity ?? 5
  );
  const [headacheType, setHeadacheType] = useState<HeadacheType | undefined>(
    initialRecord?.headacheType
  );
  const [location, setLocation] = useState<HeadacheLocation | undefined>(
    initialRecord?.location
  );
  const [duration, setDuration] = useState<number>(
    initialRecord?.duration ?? 30
  );
  const [triggers, setTriggers] = useState<HeadacheTrigger[]>(
    initialRecord?.triggers ?? []
  );
  const [medications, setMedications] = useState<HeadacheMedication[]>(
    initialRecord?.medications ?? []
  );
  const [notes, setNotes] = useState(initialRecord?.notes ?? '');

  const toggleTrigger = (trigger: HeadacheTrigger) => {
    setTriggers((prev) =>
      prev.includes(trigger)
        ? prev.filter((t) => t !== trigger)
        : [...prev, trigger]
    );
  };

  const toggleMedication = (medication: HeadacheMedication) => {
    setMedications((prev) =>
      prev.includes(medication)
        ? prev.filter((m) => m !== medication)
        : [...prev, medication]
    );
  };

  const canSubmit = severity > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    if (isLimitReached) {
      onPresentPaywall?.();
      return;
    }

    const eventDateTime = date.toISOString();
    const recordDate = format(date, 'yyyy-MM-dd');
    const record: HeadacheRecord = {
      id: isEditMode ? initialRecord.id : (uuid.v4() as string),
      event: eventDateTime,
      severity,
      headacheType,
      location,
      duration,
      triggers: triggers.length > 0 ? triggers : undefined,
      medications: medications.length > 0 ? medications : undefined,
      notes: notes.trim() || undefined,
      createdAt: isEditMode
        ? initialRecord.createdAt
        : new Date().toISOString(),
    };

    if (isEditMode) {
      await updateRecord({ record });
    } else {
      await createRecord({ record });
      void requestReview({ totalLogCount: records.length + 1 });
    }

    onSubmit?.({ date, severity });
    onNavigateHome?.({ date: recordDate });
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        paddingTop,
        paddingBottom,
      }}
      contentContainerClassName="gap-6"
      className="bg-background"
    >
      {/* Date & Time */}
      <View className="px-4 gap-6">
        <InputContainer
          label={isEditMode ? t('log.dateTime') : t('log.whenDidItStart')}
        >
          <View className="flex-row gap-2 ml-[-8px]">
            <DateTimePicker
              value={date}
              mode="date"
              maximumDate={new Date()}
              onChange={setDate}
            />
            <DateTimePicker
              value={date}
              mode="time"
              onChange={setDate}
            />
          </View>
        </InputContainer>
      </View>

      {/* Severity */}
      <InputContainer
        label={t('log.severity')}
        className="px-4"
      >
        <NumberStepper
          value={severity}
          onChange={({ value }) => setSeverity(value)}
          min={1}
          max={10}
          step={1}
          unit={t('log.severityScale')}
        />
      </InputContainer>

      {/* Headache Type */}
      <InputContainer
        label={t('log.headacheType')}
        className="px-4"
      >
        <View className="flex-row flex-wrap gap-2">
          {HEADACHE_TYPES.map((type) => (
            <Pressable
              key={type}
              onPress={() =>
                setHeadacheType(headacheType === type ? undefined : type)
              }
              className={`px-4 py-2 rounded-full border ${
                headacheType === type
                  ? 'bg-primary border-primary'
                  : 'bg-card border-border'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  headacheType === type ? 'text-primary-foreground' : ''
                }`}
              >
                {t(`log.headacheTypes.${type}`)}
              </Text>
            </Pressable>
          ))}
        </View>
      </InputContainer>

      {/* Location */}
      <InputContainer
        label={t('log.location')}
        className="px-4"
      >
        <View className="flex-row flex-wrap gap-2">
          {HEADACHE_LOCATIONS.map((loc) => (
            <Pressable
              key={loc}
              onPress={() => setLocation(location === loc ? undefined : loc)}
              className={`px-4 py-2 rounded-full border ${
                location === loc
                  ? 'bg-primary border-primary'
                  : 'bg-card border-border'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  location === loc ? 'text-primary-foreground' : ''
                }`}
              >
                {t(`log.locations.${loc}`)}
              </Text>
            </Pressable>
          ))}
        </View>
      </InputContainer>

      {/* Duration */}
      <InputContainer
        label={t('log.duration')}
        className="px-4"
      >
        <NumberStepper
          value={duration}
          onChange={({ value }) => setDuration(value)}
          min={15}
          max={480}
          step={15}
          unit={t('log.minutes')}
        />
      </InputContainer>

      {/* Triggers */}
      <InputContainer
        label={t('log.triggers')}
        description={t('log.selectAllThatApply')}
        className="px-4"
      >
        <View className="flex-row flex-wrap gap-2">
          {HEADACHE_TRIGGERS.map((trigger) => (
            <Pressable
              key={trigger}
              onPress={() => toggleTrigger(trigger)}
              className={`px-4 py-2 rounded-full border ${
                triggers.includes(trigger)
                  ? 'bg-primary border-primary'
                  : 'bg-card border-border'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  triggers.includes(trigger) ? 'text-primary-foreground' : ''
                }`}
              >
                {t(`log.triggerOptions.${trigger}`)}
              </Text>
            </Pressable>
          ))}
        </View>
      </InputContainer>

      {/* Medications */}
      <InputContainer
        label={t('log.medications')}
        description={t('log.selectAllThatApply')}
        className="px-4"
      >
        <View className="flex-row flex-wrap gap-2">
          {HEADACHE_MEDICATIONS.map((med) => (
            <Pressable
              key={med}
              onPress={() => toggleMedication(med)}
              className={`px-4 py-2 rounded-full border ${
                medications.includes(med)
                  ? 'bg-primary border-primary'
                  : 'bg-card border-border'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  medications.includes(med) ? 'text-primary-foreground' : ''
                }`}
              >
                {t(`log.medicationOptions.${med}`)}
              </Text>
            </Pressable>
          ))}
        </View>
      </InputContainer>

      {/* Notes */}
      <View className="gap-2 px-4">
        <View className="flex-row items-center gap-2">
          <InputLabel>{t('log.notes')}</InputLabel>
        </View>
        <InputDescription className="mt-[-2px]">
          {t('log.optional')}
        </InputDescription>
        <Textarea
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      {/* Submit Button */}
      <Button
        onPress={handleSubmit}
        disabled={!canSubmit}
        className="m-4"
        size="lg"
      >
        <Text>{isEditMode ? t('log.update') : t('log.logButton')}</Text>
      </Button>
    </KeyboardAwareScrollView>
  );
};
