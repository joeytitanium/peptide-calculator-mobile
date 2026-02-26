import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { useColorScheme } from '@/lib/use-color-scheme';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable } from 'react-native';

type DateTimePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
  mode?: 'time' | 'date';
  maximumDate?: Date;
  /** iOS display style. Defaults to "compact". */
  iosDisplay?: 'compact' | 'spinner';
  /** Additional className applied to the iOS wrapper. */
  iosClassName?: string;
  /** Text size class for the Android pressable label. Defaults to "text-base". */
  androidTextClassName?: string;
};

export const DateTimePicker = ({
  value,
  onChange,
  mode = 'time',
  maximumDate,
  iosDisplay = 'compact',
  iosClassName,
  androidTextClassName = 'text-base',
}: DateTimePickerProps) => {
  const { isDarkColorScheme } = useColorScheme();
  const [show, setShow] = useState(false);

  if (Platform.OS !== 'android') {
    return (
      <RNDateTimePicker
        className={iosClassName}
        value={value}
        mode={mode}
        display={iosDisplay}
        maximumDate={maximumDate}
        themeVariant={isDarkColorScheme ? 'dark' : 'light'}
        onChange={(_, selectedDate) => {
          if (selectedDate) onChange(selectedDate);
        }}
        accentColor={CONFIG.tintColor.hex}
      />
    );
  }

  const label =
    mode === 'time'
      ? value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : value.toLocaleDateString([], {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

  return (
    <>
      <Pressable
        onPress={() => setShow(true)}
        className="bg-accent active:bg-accent/70 rounded-full px-3 py-1"
      >
        <Text className={`text-primary ${androidTextClassName}`}>{label}</Text>
      </Pressable>
      {show && (
        <RNDateTimePicker
          value={value}
          mode={mode}
          display="default"
          maximumDate={maximumDate}
          onChange={(_: DateTimePickerEvent, selectedDate?: Date) => {
            setShow(false);
            if (selectedDate) onChange(selectedDate);
          }}
        />
      )}
    </>
  );
};
