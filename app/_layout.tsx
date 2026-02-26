import '@/global.css';
import '@/lib/i18n';

import { useNotificationResponseListener } from '@/lib/push-notifications';
import { Providers } from '@/providers';
import { PortalHost } from '@rn-primitives/portal';

import { Stack } from 'expo-router';
import { View } from 'react-native';

function RootLayoutNav() {
  // Handle deep linking from push notifications
  useNotificationResponseListener();

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen
          name="(app)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="dev/set-locale"
          options={{ headerShown: false }}
        />
      </Stack>
      <PortalHost />
    </View>
  );
}

export default function AppLayout() {
  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  );
}
