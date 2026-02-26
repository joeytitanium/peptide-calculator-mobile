import { CONFIG } from '@/config';
import { Platform, Switch as RNSwitch, SwitchProps } from 'react-native';
import colors from 'tailwindcss/colors';

export const Switch = (props: SwitchProps) => (
  <RNSwitch
    trackColor={{
      true: CONFIG.tintColor.hex,
      false: colors.current,
    }}
    thumbColor={Platform.OS === 'android' ? CONFIG.tintColor.hex : undefined}
    {...props}
  />
);
