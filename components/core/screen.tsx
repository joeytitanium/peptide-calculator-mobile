import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
};

/**
 * Wraps screen content with a nested SafeAreaProvider so that
 * useSafeAreaInsets() inside children reflects the actual safe area
 * of the native content view (e.g. inside NativeTabs, the bottom
 * inset includes the tab bar height automatically).
 */
export function Screen({ children }: Props) {
  return (
    <SafeAreaProvider style={styles.container}>{children}</SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
