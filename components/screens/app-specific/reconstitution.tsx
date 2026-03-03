import { StickyOutputPanel } from '@/components/app-specific/sticky-output-panel';
import { GlowIcon } from '@/components/core/glow-icon';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
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
  Syringe as SyringeIcon,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

iconWithClassName(SyringeIcon);
iconWithClassName(FlaskConical);
iconWithClassName(Droplets);
iconWithClassName(Info);
iconWithClassName(Lock);

const DISPLAY_MODE_LABELS: Record<SyringeDisplayMode, string> = {
  units: 'Units',
  ml: 'mL',
};

const PRO_SYRINGE_SIZES: readonly SyringeSize[] = [27, 30, 50];

type ReconstitutionScreenProps = {
  hasActiveSubscription: boolean;
  onPresentPaywall: () => void;
};

export function ReconstitutionScreen({
  hasActiveSubscription,
  onPresentPaywall,
}: ReconstitutionScreenProps) {
  const { paddingTop, bottom } = useSafeAreaInsets({
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
                  Syringe Configuration
                </Text>
              </View>

              <Text className="text-sm font-medium">Syringe Type</Text>
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
                    <Text>{DISPLAY_MODE_LABELS[mode]}</Text>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>

              <Text className="text-sm font-medium">Syringe Size</Text>
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
                    !hasActiveSubscription &&
                    PRO_SYRINGE_SIZES.includes(size);
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
                <Text className="text-base font-semibold">Peptide Details</Text>
              </View>

              <View className="gap-1.5">
                <Text className="text-sm font-medium">
                  Peptide amount in vial
                </Text>
                <Input
                  value={peptideAmountMg}
                  onChangeText={setPeptideAmountMg}
                  placeholder="e.g. 5"
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                />
                <Text className="text-xs text-muted-foreground">mg</Text>
              </View>

              <View className="gap-1.5">
                <Text className="text-sm font-medium">Desired dose</Text>
                <Input
                  value={desiredDose}
                  onChangeText={setDesiredDose}
                  placeholder={doseUnit === 'mcg' ? 'e.g. 250' : 'e.g. 0.25'}
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
                  Desired {displayMode === 'units' ? 'units' : 'mL'} to draw per
                  dose
                </Text>
                <Input
                  value={desiredUnits}
                  onChangeText={setDesiredUnits}
                  placeholder="e.g. 25"
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                />
                <Text className="text-xs text-muted-foreground">
                  {displayMode === 'units' ? 'units' : 'mL'}
                  {displayMode === 'units' &&
                    desiredMl != null &&
                    ` (≈ ${desiredMl} mL)`}
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>
      </KeyboardAwareScrollView>

      {/* Sticky result */}
      <StickyOutputPanel
        bottom={bottom}
        onLayout={(e) => setStickyHeight(e.nativeEvent.layout.height)}
      >
        {result ? (
          <Card className="rounded-none bg-transparent">
            <CardContent className="gap-3">
              {/* Main value */}
              <View className="flex-row items-baseline justify-between">
                <View className="flex-row items-baseline gap-2">
                  <Text className="text-3xl font-bold text-foreground">
                    {result.waterToAddMl} mL
                  </Text>
                  <Text className="text-sm text-muted-foreground">to add</Text>
                </View>
                <View className="flex-row items-baseline gap-1">
                  <Text className="text-3xl font-bold text-foreground">
                    {result.dosesPerVial}
                  </Text>
                  <Text className="text-sm text-muted-foreground">doses</Text>
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
                    BAC water
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Info
                    size={13}
                    className="text-muted-foreground"
                  />
                  <Text className="text-sm text-muted-foreground">
                    {result.concentrationMcgPerMl} mcg/mL
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
                <Text className="text-base font-semibold">Result</Text>
              </View>
              <View className="items-center py-4">
                <Text className="text-sm text-muted-foreground">
                  Enter values above to see result
                </Text>
              </View>
            </CardContent>
          </Card>
        )}
      </StickyOutputPanel>
    </>
  );
}
