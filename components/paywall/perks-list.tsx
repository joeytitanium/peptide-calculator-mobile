import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { clsx } from 'clsx';
import { Beaker, BellOff, Heart, Syringe } from 'lucide-react-native';

import { GlassView } from '@/components/core/glass-view';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

iconWithClassName(Syringe);
iconWithClassName(Beaker);
iconWithClassName(BellOff);
iconWithClassName(Heart);

const perks = [
  {
    icon: Syringe,
    titleKey: 'paywall.perks.allSyringes.title',
    descriptionKey: 'paywall.perks.allSyringes.description',
  },
  {
    icon: Beaker,
    titleKey: 'paywall.perks.unlimitedBlends.title',
    descriptionKey: 'paywall.perks.unlimitedBlends.description',
  },
  {
    icon: BellOff,
    titleKey: 'paywall.perks.noPopups.title',
    descriptionKey: 'paywall.perks.noPopups.description',
  },
  {
    icon: Heart,
    titleKey: 'paywall.perks.indieDeveloper.title',
    descriptionKey: 'paywall.perks.indieDeveloper.description',
  },
] as const;

export const PerksList = ({ className }: { className?: string }) => {
  const { t } = useTranslation();

  return (
    <View className={clsx('gap-6 pb-6', className)}>
      {perks.map((feature, index) => (
        <View
          key={index}
          className="flex-row gap-4"
        >
          <GlassView
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <feature.icon
              size={CONFIG.icon.size.md}
              className="text-foreground"
            />
          </GlassView>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-foreground leading-tight">
              {t(feature.titleKey)}
            </Text>
            <Text className="text-base text-muted-foreground">
              {t(feature.descriptionKey)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};
