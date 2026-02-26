import { Platform } from 'react-native';

export const isIos26OrGreater = (): boolean => {
  if (Platform.OS !== 'ios') {
    return false;
  }

  const iosVersion = parseInt(Platform.Version as string, 10);
  return iosVersion >= 26;
};
