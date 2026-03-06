import { StickyOutputPanel } from '@/components/app-specific/sticky-output-panel';

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
  calculateReconstitution,
  parseNumericInput,
} from '@/utils/app-specific/calculator-math';
import {
  Droplets,
  FlaskConical,
  Info,
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
iconWithClassName(Droplets);
iconWithClassName(Info);
iconWithClassName(Lock);
iconWithClassName(Star);

const PRO_SYRINGE_SIZES: readonly SyringeSize[] = [27, 30, 50];

type ReconstitutionScreenProps = {
  hasActiveSubscription: boolean;
  onPresentPaywall: () => void;
  onRequestReview: () => void;
};

export function ReconstitutionScreen({
  hasActiveSubscription,
  onPresentPaywall,
  onRequestReview,
}: ReconstitutionScreenProps) {
  const { t } = useTranslation();
  const { paddingTop } = useSafeAreaInsets({
    navigationBarPadding: 'none',
    nativePadding: 'none',
  });

  const [peptideAmountMg, setPeptideAmountMg] = useState('5');
  const [desiredDose, setDesiredDose] = useState('250');
  const [doseUnit, setDoseUnit] = useState<DoseUnit>('mcg');
  const [desiredUnits, setDesiredUnits] = useState('25');
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
    const dose = parseNumericInput(desiredDose);
    const units = parseNumericInput(desiredUnits);

    if (isNaN(peptide) || isNaN(dose) || isNaN(units)) {
      return null;
    }

    return calculateReconstitution({
      peptideAmountMg: peptide,
      desiredDoseMcg: doseUnit === 'mg' ? dose * 1000 : dose,
      desiredUnits: units,
    });
  }, [peptideAmountMg, desiredDose, doseUnit, desiredUnits]);

  const desiredMl = useMemo(() => {
    const units = parseNumericInput(desiredUnits);
    if (isNaN(units)) return null;
    return Math.round((units / 100) * 1000) / 1000;
  }, [desiredUnits]);

  return (
    <>
      <KeyboardAwareScrollView
        testID="reconstitution-screen"
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
                  size="sm"
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

              <View className="gap-1.5">
                <Text className="text-sm font-medium">
                  {displayMode === 'units'
                    ? t('calculator.desiredDrawUnits')
                    : t('calculator.desiredDrawMl')}
                </Text>
                <Input
                  value={desiredUnits}
                  onChangeText={setDesiredUnits}
                  placeholder={t('calculator.placeholderDraw')}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                />
                <Text className="text-xs text-muted-foreground">
                  {displayMode === 'units'
                    ? t('calculator.units')
                    : t('calculator.unitMl')}
                  {displayMode === 'units' &&
                    desiredMl != null &&
                    ` (${t('calculator.approxMl', { value: desiredMl })})`}
                </Text>
              </View>
            </CardContent>
          </Card>
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

      {/* Sticky result */}
      <StickyOutputPanel
        onLayout={(e) => setStickyHeight(e.nativeEvent.layout.height)}
      >
        {result ? (
          <Card className="rounded-none bg-transparent">
            <CardContent className="gap-3">
              {/* Main value */}
              <View className="flex-row items-baseline justify-between">
                <View className="flex-row items-baseline gap-2">
                  <Text className="text-3xl font-bold text-foreground">
                    {result.waterToAddMl} {t('calculator.unitMl')}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {t('calculator.toAdd')}
                  </Text>
                </View>
                <View className="flex-row items-baseline gap-1">
                  <Text className="text-3xl font-bold text-foreground">
                    {result.dosesPerVial}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {t('calculator.doses')}
                  </Text>
                </View>
              </View>

              {/* Stats */}
              <View className="flex-row justify-between">
                <View className="flex-row items-center gap-1.5">
                  <Droplets
                    size={13}
                    className="text-muted-foreground"
                  />
                  <Text className="text-sm text-muted-foreground">
                    {t('calculator.bacWater')}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Info
                    size={13}
                    className="text-muted-foreground"
                  />
                  <Text className="text-sm text-muted-foreground">
                    {result.concentrationMcgPerMl}{' '}
                    {t('calculator.concentrationUnit')}
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-none bg-transparent">
            <CardContent className="gap-4">
              <View className="flex-row items-center gap-3 pb-2">
                <GlowIcon
                  icon={Droplets}
                  color="teal"
                  size={18}
                />
                <Text className="text-base font-semibold">
                  {t('calculator.result')}
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
