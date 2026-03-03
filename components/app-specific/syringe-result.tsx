import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import type { SyringeSize } from '@/types/app-specific/calculation';
import { Droplet, Info, Ruler } from 'lucide-react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

iconWithClassName(Droplet);
iconWithClassName(Info);
iconWithClassName(Ruler);

function getTickInterval({
  syringeSize,
}: {
  syringeSize: SyringeSize;
}): number {
  if (syringeSize <= 30) return 5;
  if (syringeSize <= 50) return 10;
  return 10;
}

type SyringeResultProps = {
  unitsToDraw: number;
  volumeToDrawMl: number;
  syringeSize: SyringeSize;
  concentrationMcgPerMl: number;
  displayMode: 'units' | 'ml';
  estimatedDraws?: number;
  className?: string;
};

export function SyringeResult({
  unitsToDraw,
  volumeToDrawMl,
  syringeSize,
  concentrationMcgPerMl,
  displayMode,
  estimatedDraws,
  className,
}: SyringeResultProps) {
  const { t } = useTranslation();
  const fillPercent = useMemo(
    () => Math.min((unitsToDraw / syringeSize) * 100, 100),
    [unitsToDraw, syringeSize]
  );

  const tickInterval = getTickInterval({ syringeSize });
  const tickCount = Math.floor(syringeSize / tickInterval);
  const ticks = useMemo(() => {
    const result: number[] = [];
    for (let i = 0; i <= tickCount; i++) {
      result.push(i * tickInterval);
    }
    return result;
  }, [tickCount, tickInterval]);

  const primaryValue =
    displayMode === 'units' ? `${unitsToDraw} ${t('calculator.units')}` : `${volumeToDrawMl} ${t('calculator.unitMl')}`;

  const secondaryValue =
    displayMode === 'units'
      ? `≈ ${volumeToDrawMl} ${t('calculator.unitMl')}`
      : `≈ ${unitsToDraw} ${t('calculator.units')}`;

  const syringeLabel =
    displayMode === 'ml'
      ? `${(syringeSize / 100).toFixed(1)} ${t('calculator.unitMl')}`
      : `${syringeSize} ${t('calculator.units')}`;

  return (
    <Card className={className}>
      <CardContent className="gap-3">
        {/* Main value */}
        <View className="flex-row items-baseline justify-between">
          <View className="flex-row items-baseline gap-2">
            <Text className="text-3xl font-bold text-foreground">
              {primaryValue}
            </Text>
            <Text className="text-sm text-muted-foreground">
              {secondaryValue}
            </Text>
          </View>
          {estimatedDraws != null && (
            <View className="flex-row items-baseline gap-1">
              <Text className="text-3xl font-bold text-foreground">
                {estimatedDraws}
              </Text>
              <Text className="text-sm text-muted-foreground">{t('calculator.draws')}</Text>
            </View>
          )}
        </View>

        {/* Syringe barrel */}
        <View className="gap-1">
          <View className="relative h-8 overflow-hidden rounded-md border-2 border-border">
            {/* Fill */}
            <View
              className="absolute inset-y-0 left-0"
              style={{
                width: `${fillPercent}%`,
                backgroundColor: CONFIG.tintColor.hex + '66',
              }}
            />
            {/* Needle indicator at fill edge */}
            <View
              className="absolute inset-y-0 w-0.5"
              style={{
                left: `${fillPercent}%`,
                marginLeft: -1,
                backgroundColor: CONFIG.tintColor.hex,
              }}
            />
          </View>
          {/* Tick marks */}
          <View className="relative h-6">
            {ticks.map((tick) => {
              const isFirst = tick === 0;
              const isLast = tick === syringeSize;
              const position = (tick / syringeSize) * 100;
              const isMajor =
                tick % (tickInterval * 2) === 0 || isFirst || isLast;
              const label =
                displayMode === 'ml' ? (tick / 100).toFixed(1) : `${tick}`;

              if (isFirst) {
                return (
                  <View
                    key={tick}
                    className="absolute left-0"
                  >
                    <View className="w-px h-2.5 bg-muted-foreground" />
                    <Text className="text-[9px] text-muted-foreground">
                      {label}
                    </Text>
                  </View>
                );
              }

              if (isLast) {
                return (
                  <View
                    key={tick}
                    className="absolute right-0 items-end"
                  >
                    <View className="w-px h-2.5 bg-muted-foreground" />
                    <Text className="text-[9px] text-muted-foreground">
                      {label}
                    </Text>
                  </View>
                );
              }

              return (
                <View
                  key={tick}
                  className="absolute items-center"
                  style={{ left: `${position}%`, width: 30, marginLeft: -15 }}
                >
                  <View
                    className={`w-px bg-muted-foreground ${isMajor ? 'h-2.5' : 'h-1.5'}`}
                  />
                  {isMajor && (
                    <Text className="text-[9px] text-muted-foreground text-center">
                      {label}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between">
          <View className="flex-row items-center gap-1.5">
            <Droplet
              size={13}
              className="text-muted-foreground"
            />
            <Text className="text-sm text-muted-foreground">
              {primaryValue}
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Info
              size={13}
              className="text-muted-foreground"
            />
            <Text className="text-sm text-muted-foreground">
              {concentrationMcgPerMl} {t('calculator.concentrationUnit')}
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Ruler
              size={13}
              className="text-muted-foreground"
            />
            <Text className="text-sm text-muted-foreground">
              {syringeLabel}
            </Text>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}
