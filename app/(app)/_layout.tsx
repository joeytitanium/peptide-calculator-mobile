import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTransparent: Platform.OS === 'ios',
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name="paywall"
        options={{
          animation: 'slide_from_bottom',
          presentation: 'fullScreenModal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          title: '',
          presentation: 'fullScreenModal',
          headerShown: true,
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
