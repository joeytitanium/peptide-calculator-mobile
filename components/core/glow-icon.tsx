import { Icon } from '@/components/ui/icon';
import { useColorScheme } from '@/lib/use-color-scheme';
import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';
import colors from 'tailwindcss/colors';

const GLOW_ICON_COLORS = {
  blue: {
    className: 'text-blue-500 dark:text-blue-400',
    glowLight: colors.blue[600],
    glowDark: colors.blue[400],
  },
  purple: {
    className: 'text-purple-500 dark:text-purple-400',
    glowLight: colors.purple[600],
    glowDark: colors.purple[400],
  },
  amber: {
    className: 'text-amber-500 dark:text-amber-400',
    glowLight: colors.amber[600],
    glowDark: colors.amber[400],
  },
  teal: {
    className: 'text-teal-500 dark:text-teal-400',
    glowLight: colors.teal[600],
    glowDark: colors.teal[400],
  },
  violet: {
    className: 'text-violet-500 dark:text-violet-400',
    glowLight: colors.violet[600],
    glowDark: colors.violet[400],
  },
  rose: {
    className: 'text-rose-500 dark:text-rose-400',
    glowLight: colors.rose[600],
    glowDark: colors.rose[400],
  },
} as const;

type GlowIconColor = keyof typeof GLOW_ICON_COLORS;

type GlowIconProps = {
  icon: LucideIcon;
  color?: GlowIconColor;
  size?: number;
  glow?: boolean;
};

export function GlowIcon({ icon, color = 'blue', size = 16, glow = true }: GlowIconProps) {
  const { isDarkColorScheme } = useColorScheme();
  const colorConfig = GLOW_ICON_COLORS[color];
  const glowColor = isDarkColorScheme
    ? colorConfig.glowDark
    : colorConfig.glowLight;

  return (
    <View
      className="h-9 w-9 items-center justify-center rounded-full bg-muted"
      style={glow ? {
        shadowColor: glowColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
      } : undefined}
    >
      <Icon as={icon} size={size} className={colorConfig.className} />
    </View>
  );
}

export type { GlowIconColor };
