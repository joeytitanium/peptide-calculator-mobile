import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { clsx } from 'clsx';
import { Beaker, Heart, LockOpen, Syringe } from 'lucide-react-native';

import { GlassView } from '@/components/core/glass-view';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

iconWithClassName(Syringe);
iconWithClassName(Beaker);
iconWithClassName(LockOpen);
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
    icon: LockOpen,
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
    <View className={clsx('gap-3 pb-6', className)}>
      {perks.map((feature, index) => (
        <View
          key={index}
          className="flex-row items-center gap-3"
        >
          <GlassView
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <feature.icon
              size={CONFIG.icon.size.sm}
              className="text-foreground"
            />
          </GlassView>
          <Text className="text-base font-medium text-foreground">
            {t(feature.titleKey)}
          </Text>
        </View>
      ))}
    </View>
  );
};
