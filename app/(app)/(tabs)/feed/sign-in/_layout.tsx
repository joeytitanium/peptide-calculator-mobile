import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerTransparent: Platform.OS === 'ios',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="setup-profile" />
    </Stack>
  );
}
