import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        title: '',
      }}
    >
      <Stack.Screen
        name="paywall"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
