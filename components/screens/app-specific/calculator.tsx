import { StickyOutputPanel } from '@/components/app-specific/sticky-output-panel';
import { SyringeResult } from '@/components/app-specific/syringe-result';
import { GlowIcon } from '@/components/core/glow-icon';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useSafeAreaInsets } from '@/hooks/use-safe-area-insets';
import type {
  DoseUnit,
  SyringeDisplayMode,
  SyringeSize,
} from '@/types/app-specific/calculation';
import {
  DOSE_UNITS,
  SYRINGE_DISPLAY_MODES,
  SYRINGE_SIZES,
} from '@/types/app-specific/calculation';
import {
  calculatePeptideDose,
  parseNumericInput,
} from '@/utils/app-specific/calculator-math';
import {
  FlaskConical,
  Lock,
  Star,
  Syringe as SyringeIcon,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

iconWithClassName(SyringeIcon);
iconWithClassName(FlaskConical);
iconWithClassName(Lock);
iconWithClassName(Star);

const PRO_SYRINGE_SIZES: readonly SyringeSize[] = [27, 30, 50];

type CalculatorScreenProps = {
  hasActiveSubscription: boolean;
  onPresentPaywall: () => void;
  onRequestReview: () => void;
};

export function CalculatorScreen({
  hasActiveSubscription,
  onPresentPaywall,
  onRequestReview,
}: CalculatorScreenProps) {
  const { t } = useTranslation();
  const { paddingTop, bottom } = useSafeAreaInsets({
    navigationBarPadding: 'none',
    nativePadding: 'none',
  });

  const [peptideAmountMg, setPeptideAmountMg] = useState('5');
  const [waterVolumeMl, setWaterVolumeMl] = useState('2');
  const [desiredDose, setDesiredDose] = useState('250');
  const [doseUnit, setDoseUnit] = useState<DoseUnit>('mcg');
  const [syringeSize, setSyringeSize] = useState<SyringeSize>(100);
  const [displayMode, setDisplayMode] = useState<SyringeDisplayMode>('units');
  const [stickyHeight, setStickyHeight] = useState(0);

  const handleDoseUnitChange = (newUnit: DoseUnit) => {
    const current = parseNumericInput(desiredDose);
    if (!isNaN(current) && current > 0) {
      setDesiredDose(
        newUnit === 'mg'
          ? String(+(current / 1000).toPrecision(6))
          : String(+(current * 1000).toPrecision(6))
      );
    }
    setDoseUnit(newUnit);
  };

  const result = useMemo(() => {
    const peptide = parseNumericInput(peptideAmountMg);
    const water = parseNumericInput(waterVolumeMl);
    const dose = parseNumericInput(desiredDose);

    if (isNaN(peptide) || isNaN(water) || isNaN(dose)) {
      return null;
    }

    return calculatePeptideDose({
      peptideAmountMg: peptide,
      waterVolumeMl: water,
      desiredDoseMcg: doseUnit === 'mg' ? dose * 1000 : dose,
      syringeSize,
    });
  }, [peptideAmountMg, waterVolumeMl, desiredDose, doseUnit, syringeSize]);

  return (
    <>
      <KeyboardAwareScrollView
        testID="calculator-screen"
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingTop, paddingBottom: stickyHeight + 32 }}
        keyboardDismissMode="on-drag"
      >
        <View className="gap-6 px-4">
          {/* Syringe Config */}
          <Card>
            <CardContent className="gap-4">
              <View className="flex-row items-center gap-3 pb-2">
                <GlowIcon
                  icon={SyringeIcon}
                  color="violet"
                  size={18}
                />
                <Text className="text-base font-semibold">
                  {t('calculator.syringeConfiguration')}
                </Text>
              </View>

              <Text className="text-sm font-medium">
                {t('calculator.syringeType')}
              </Text>
              <ToggleGroup
                type="single"
                value={displayMode}
                onValueChange={(value) => {
                  if (value) setDisplayMode(value as SyringeDisplayMode);
                }}
                variant="outline"
                className="w-full"
              >
                {SYRINGE_DISPLAY_MODES.map((mode, index) => (
                  <ToggleGroupItem
                    key={mode}
                    value={mode}
                    isFirst={index === 0}
                    isLast={index === SYRINGE_DISPLAY_MODES.length - 1}
                    className="flex-1"
                  >
                    <Text>
                      {t(
                        `calculator.displayMode${mode === 'units' ? 'Units' : 'Ml'}`
                      )}
                    </Text>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>

              <Text className="text-sm font-medium">
                {t('calculator.syringeSize')}
              </Text>
              <ToggleGroup
                type="single"
                value={String(syringeSize)}
                onValueChange={(value) => {
                  if (!value) return;
                  const size = Number(value) as SyringeSize;
                  if (
                    !hasActiveSubscription &&
                    PRO_SYRINGE_SIZES.includes(size)
                  ) {
                    onPresentPaywall();
                    return;
                  }
                  setSyringeSize(size);
                }}
                variant="outline"
                className="w-full"
              >
                {SYRINGE_SIZES.map((size, index) => {
                  const isLocked =
                    !hasActiveSubscription && PRO_SYRINGE_SIZES.includes(size);
                  return (
                    <ToggleGroupItem
                      key={size}
                      value={String(size)}
                      isFirst={index === 0}
                      isLast={index === SYRINGE_SIZES.length - 1}
                      className="flex-1"
                    >
                      <View className="flex-row items-center gap-1">
                        <Text>{size}</Text>
                        {isLocked && (
                          <Lock
                            size={12}
                            className="text-muted-foreground"
                          />
                        )}
                      </View>
                    </ToggleGroupItem>
                  );
                })}
              </ToggleGroup>
            </CardContent>
          </Card>

          {/* Inputs */}
          <Card>
            <CardContent className="gap-4">
              <View className="flex-row items-center gap-3 pb-2">
                <GlowIcon
                  icon={FlaskConical}
                  color="blue"
                  size={18}
                />
                <Text className="text-base font-semibold">
                  {t('calculator.peptideDetails')}
                </Text>
              </View>

              <View className="gap-1.5">
                <Text className="text-sm font-medium">
                  {t('calculator.peptideAmountInVial')}
                </Text>
                <Input
                  value={peptideAmountMg}
                  onChangeText={setPeptideAmountMg}
                  placeholder={t('calculator.placeholderAmount')}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                />
                <Text className="text-xs text-muted-foreground">
                  {t('calculator.unitMg')}
                </Text>
              </View>

              <View className="gap-1.5">
                <Text className="text-sm font-medium">
                  {t('calculator.bacWaterAdded')}
                </Text>
                <Input
                  value={waterVolumeMl}
                  onChangeText={setWaterVolumeMl}
                  placeholder={t('calculator.placeholderWater')}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                />
                <Text className="text-xs text-muted-foreground">
                  {t('calculator.unitMl')}
                </Text>
              </View>

              <View className="gap-1.5">
                <Text className="text-sm font-medium">
                  {t('calculator.desiredDose')}
                </Text>
                <Input
                  value={desiredDose}
                  onChangeText={setDesiredDose}
                  placeholder={
                    doseUnit === 'mcg'
                      ? t('calculator.placeholderDoseMcg')
                      : t('calculator.placeholderDoseMg')
                  }
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                />
                <ToggleGroup
                  type="single"
                  value={doseUnit}
                  onValueChange={(value) => {
                    if (value) handleDoseUnitChange(value as DoseUnit);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  {DOSE_UNITS.map((unit, index) => (
                    <ToggleGroupItem
                      key={unit}
                      value={unit}
                      isFirst={index === 0}
                      isLast={index === DOSE_UNITS.length - 1}
                      className="flex-1"
                    >
                      <Text>{unit}</Text>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </View>
            </CardContent>
          </Card>

          {/* Warnings + save (only when result exists) */}
          {result && (
            <>
              {result.exceedsSyringe && (
                <Card>
                  <CardContent>
                    <View className="rounded-lg bg-destructive/10 p-3">
                      <Text className="text-sm text-destructive">
                        {t('calculator.exceedsSyringe', { syringeSize })}
                      </Text>
                    </View>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <Button
            variant="ghost"
            onPress={onRequestReview}
          >
            <Star
              size={16}
              className="text-foreground"
            />
            <Text>{t('review.title')}</Text>
          </Button>
        </View>
      </KeyboardAwareScrollView>

      {/* Sticky preparation output */}
      <StickyOutputPanel
        bottom={bottom}
        onLayout={(e) => setStickyHeight(e.nativeEvent.layout.height)}
      >
        {result ? (
          <SyringeResult
            unitsToDraw={result.unitsToDraw}
            volumeToDrawMl={result.volumeToDrawMl}
            syringeSize={syringeSize}
            concentrationMcgPerMl={result.concentrationMcgPerMl}
            displayMode={displayMode}
            estimatedDraws={result.estimatedDraws}
            className="rounded-none bg-transparent"
          />
        ) : (
          <Card className="rounded-none bg-transparent">
            <CardContent className="gap-4">
              <View className="flex-row items-center gap-3 pb-2">
                <GlowIcon
                  icon={SyringeIcon}
                  color="violet"
                  size={18}
                />
                <Text className="text-base font-semibold">
                  {t('calculator.preparationOutput')}
                </Text>
              </View>
              <View className="items-center py-4">
                <Text className="text-sm text-muted-foreground">
                  {t('calculator.enterValues')}
                </Text>
              </View>
            </CardContent>
          </Card>
        )}
      </StickyOutputPanel>
    </>
  );
}
