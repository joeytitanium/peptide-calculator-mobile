import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { CONFIG } from '@/config';
import { useColorScheme } from '@/lib/use-color-scheme';
import { Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Beaker, Calculator, Droplets, Settings } from 'lucide-react-native';
import { Platform } from 'react-native';
import colors from 'tailwindcss/colors';

iconWithClassName(Calculator);
iconWithClassName(Beaker);
iconWithClassName(Droplets);

function AndroidTabs() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: CONFIG.tintColor.hex,
        tabBarInactiveTintColor: isDarkColorScheme
          ? colors.zinc[400]
          : colors.zinc[500],
        tabBarStyle: {
          backgroundColor: isDarkColorScheme ? colors.black : colors.white,
          elevation: 0,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="calculator"
        options={{
          title: 'Peptide',
          tabBarIcon: ({ color, size }) => (
            <Calculator
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="blend"
        options={{
          title: 'Blend',
          tabBarIcon: ({ color, size }) => (
            <Beaker
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reconstitution"
        options={{
          title: 'Reconstitution',
          tabBarIcon: ({ color, size }) => (
            <Droplets
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="home"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="feed"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="history"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="log"
        options={{ href: null }}
      />
    </Tabs>
  );
}

function IosTabs() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <NativeTabs
      backgroundColor={isDarkColorScheme ? colors.black : colors.white}
      indicatorColor={isDarkColorScheme ? colors.zinc[800] : colors.zinc[100]}
      iconColor={isDarkColorScheme ? colors.zinc[100] : colors.zinc[800]}
      tintColor={CONFIG.tintColor.hex}
      labelVisibilityMode="labeled"
    >
      <NativeTabs.Trigger name="calculator">
        <NativeTabs.Trigger.Label>Peptide</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="flask.fill"
          selectedColor={CONFIG.tintColor.hex}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="blend">
        <NativeTabs.Trigger.Label>Blend</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="testtube.2"
          selectedColor={CONFIG.tintColor.hex}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="reconstitution">
        <NativeTabs.Trigger.Label>Reconstitution</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="drop.fill"
          selectedColor={CONFIG.tintColor.hex}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="gearshape"
          selectedColor={CONFIG.tintColor.hex}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

export default function AppLayout() {
  if (Platform.OS === 'android') {
    return <AndroidTabs />;
  }
  return <IosTabs />;
}
