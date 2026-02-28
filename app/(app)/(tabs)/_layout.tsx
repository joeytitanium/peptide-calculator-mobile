import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { CONFIG } from '@/config';
import { useColorScheme } from '@/lib/use-color-scheme';
import { Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { BarChart3, CalendarDays, Settings } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import colors from 'tailwindcss/colors';

iconWithClassName(BarChart3);

function AndroidTabs() {
  const { isDarkColorScheme } = useColorScheme();
  const { t } = useTranslation();

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
        name="dashboard"
        options={{
          title: t('tabs.dashboard'),
          tabBarIcon: ({ color, size }) => (
            <BarChart3
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: t('tabs.calendar'),
          tabBarIcon: ({ color, size }) => (
            <CalendarDays
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ color, size }) => (
            <Settings
              size={size}
              color={color}
            />
          ),
        }}
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
  const { t } = useTranslation();

  return (
    <NativeTabs
      backgroundColor={isDarkColorScheme ? colors.black : colors.white}
      indicatorColor={isDarkColorScheme ? colors.zinc[800] : colors.zinc[100]}
      iconColor={isDarkColorScheme ? colors.zinc[100] : colors.zinc[800]}
      tintColor={CONFIG.tintColor.hex}
      labelVisibilityMode="labeled"
    >
      <NativeTabs.Trigger name="dashboard">
        <NativeTabs.Trigger.Label>
          {t('tabs.dashboard')}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="chart.xyaxis.line"
          selectedColor={CONFIG.tintColor.hex}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>
          {t('tabs.calendar')}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="calendar"
          selectedColor={CONFIG.tintColor.hex}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>
          {t('tabs.settings')}
        </NativeTabs.Trigger.Label>
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
