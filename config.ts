import colors from 'tailwindcss/colors';

import { Platform } from 'react-native';
import { isDevelopment } from './utils/is-development';

const useSimulator = false;

// > ifconfig -> en0 -> inet
const DEVICE_IP = '172.30.1.51';

// Simulator
const LOCALHOST_PORT = 3000;

export type IconSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

/**
 * ROADMAP:
 * - Leaderboard with friends (global, friends)
 * - Streaks
 * - Badges
 * - Sharing (streaks, badges, daily logs)
 * - Community (forums, chat, etc.)
 * - Analytics (usage, engagement, etc.)
 * - Widgets
 */

export const CONFIG: {
  appSpecific: {};
  isHardPaywall: boolean;
  apiUrl: string;
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
  supportEmail: string;
  site: {
    url: string;
    name: string;
    description: string;
  };
  layout: {
    navigationBarPadding: number;
    tabBarPadding: number;
  };
  revenuecat: {
    apiKey: {
      ios: string;
      android: string;
    };
  };
  posthog: {
    enabled: boolean;
    apiKey: string;
    host: string;
  };
  icon: {
    size: Record<IconSize, number>;
  };
  tintColor: {
    base: string;
    hex: string;
    className: string;
    fillClassName: string;
  };
} = {
  appSpecific: {},
  isHardPaywall: false,
  apiUrl: (() => {
    if (isDevelopment) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      return useSimulator
        ? `http://localhost:${LOCALHOST_PORT}/api/v1`
        : `http://${DEVICE_IP}:${LOCALHOST_PORT}/api/v1`;
    }
    return 'https://peptide-tracker.titanium.dev/api/v1';
  })(),
  supportEmail: 'support@titanium.dev',
  privacyPolicyUrl: 'https://www.titanium.dev/apps/privacy',
  termsOfServiceUrl: 'https://www.titanium.dev/apps/terms',
  site: {
    url: (() => {
      if (isDevelopment) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        return !useSimulator
          ? `http://localhost:${LOCALHOST_PORT}`
          : `http://${DEVICE_IP}:${LOCALHOST_PORT}`;
      }
      return 'https://peptide-calculator.titanium.dev';
    })(),
    name: 'Peptide Calculator',
    description: 'Calculate your peptide dose',
  },
  layout: {
    navigationBarPadding: Platform.OS === 'ios' ? 50 : 50, // TODO:
    tabBarPadding: Platform.OS === 'ios' ? 49 : 0, // TODO:
  },
  revenuecat: {
    apiKey: {
      ios: 'appl_SHXPdoUavBDydGowqgGaddvuPPl',
      android: 'goog_fWLdRgCfaGXgMMhxltaCXdkoKlY',
    },
  },
  posthog: {
    enabled: false,
    apiKey: 'phc_azjaBX4SWyPnwXSeZAYdCRKIhc6RjDTh8A731Qh9v2v',
    host: 'https://us.i.posthog.com',
  },
  icon: {
    size: {
      '2xs': 12,
      xs: 16,
      sm: 21,
      md: 26,
      lg: 32,
      xl: 40,
      '2xl': 48,
      '3xl': 64,
    },
  },
  tintColor: {
    base: 'rose',
    hex: colors.rose[500],
    className: 'text-rose-500',
    fillClassName: 'fill-rose-500',
  },
} as const;
