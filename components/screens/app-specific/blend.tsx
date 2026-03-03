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
  calculateBlendDose,
  parseNumericInput,
} from '@/utils/app-specific/calculator-math';
import {
  Droplets,
  FlaskConical,
  Minus,
  Plus,
  Syringe as SyringeIcon,
} from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

iconWithClassName(SyringeIcon);
iconWithClassName(FlaskConical);
iconWithClassName(Droplets);
iconWithClassName(Plus);
iconWithClassName(Minus);

type BlendPeptideInput = {
  key: string;
  peptideName: string;
  peptideAmountMg: string;
  desiredDose: string;
};

const createEmptyEntry = (): BlendPeptideInput => ({
  key: Math.random().toString(36).slice(2),
  peptideName: '',
  peptideAmountMg: '',
  desiredDose: '',
});

const DISPLAY_MODE_LABELS: Record<SyringeDisplayMode, string> = {
  units: 'Units',
  ml: 'mL',
};

export function BlendScreen() {
  const { paddingTop, bottom } = useSafeAreaInsets({
    navigationBarPadding: 'none',
    nativePadding: 'none',
  });

  const [peptides, setPeptides] = useState<BlendPeptideInput[]>([
    {
      key: Math.random().toString(36).slice(2),
      peptideName: 'BPC-157',
      peptideAmountMg: '5',
      desiredDose: '250',
    },
    {
      key: Math.random().toString(36).slice(2),
      peptideName: 'TB-500',
      peptideAmountMg: '5',
      desiredDose: '500',
    },
  ]);
  const [waterVolumeMl, setWaterVolumeMl] = useState('2');
  const [syringeSize, setSyringeSize] = useState<SyringeSize>(100);
  const [doseUnit, setDoseUnit] = useState<DoseUnit>('mcg');
  const [displayMode, setDisplayMode] = useState<SyringeDisplayMode>('units');
  const [stickyHeight, setStickyHeight] = useState(0);

  const handleDoseUnitChange = useCallback((newUnit: DoseUnit) => {
    setPeptides((prev) =>
      prev.map((p) => {
        const current = parseNumericInput(p.desiredDose);
        if (isNaN(current) || current <= 0) return p;
        const converted =
          newUnit === 'mg'
            ? String(+(current / 1000).toPrecision(6))
            : String(+(current * 1000).toPrecision(6));
        return { ...p, desiredDose: converted };
      })
    );
    setDoseUnit(newUnit);
  }, []);

  const updatePeptide = useCallback(
    ({
      index,
      field,
      value,
    }: {
      index: number;
      field: keyof Omit<BlendPeptideInput, 'key'>;
      value: string;
    }) => {
      setPeptides((prev) =>
        prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
      );
    },
    []
  );

  const addPeptide = useCallback(() => {
    setPeptides((prev) => [...prev, createEmptyEntry()]);
  }, []);

  const removePeptide = useCallback(({ index }: { index: number }) => {
    setPeptides((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const result = useMemo(() => {
    const water = parseNumericInput(waterVolumeMl);
    if (isNaN(water)) return null;

    const parsedPeptides = peptides.map((p) => {
      const raw = parseNumericInput(p.desiredDose);
      return {
        peptideAmountMg: parseNumericInput(p.peptideAmountMg),
        desiredDoseMcg: doseUnit === 'mg' ? raw * 1000 : raw,
      };
    });

    if (
      parsedPeptides.some(
        (p) => isNaN(p.peptideAmountMg) || isNaN(p.desiredDoseMcg)
      )
    ) {
      return null;
    }

    return calculateBlendDose({
      peptides: parsedPeptides,
      waterVolumeMl: water,
      syringeSize,
    });
  }, [peptides, waterVolumeMl, syringeSize, doseUnit]);

  const blendedConcentration = useMemo(() => {
    if (!result) return 0;
    const totalMcg = peptides.reduce((sum, p) => {
      const raw = parseNumericInput(p.desiredDose);
      return sum + (doseUnit === 'mg' ? raw * 1000 : raw);
    }, 0);
    if (result.totalVolumeMl <= 0) return 0;
    return Math.round((totalMcg / result.totalVolumeMl) * 100) / 100;
  }, [result, peptides, doseUnit]);

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
                  if (value) setSyringeSize(Number(value) as SyringeSize);
                }}
                variant="outline"
                className="w-full"
              >
                {SYRINGE_SIZES.map((size, index) => (
                  <ToggleGroupItem
                    key={size}
                    value={String(size)}
                    isFirst={index === 0}
                    isLast={index === SYRINGE_SIZES.length - 1}
                    className="flex-1"
                  >
                    <Text>{size}</Text>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </CardContent>
          </Card>

          {/* Peptide entries */}
          {peptides.map((entry, index) => (
            <Card key={entry.key}>
              <CardContent className="gap-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 pb-2">
                    <GlowIcon
                      icon={FlaskConical}
                      color="blue"
                      size={18}
                    />
                    <Text className="text-base font-semibold">
                      Peptide {index + 1}
                    </Text>
                  </View>
                  {peptides.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onPress={() => removePeptide({ index })}
                    >
                      <Minus
                        size={18}
                        className="text-destructive"
                      />
                    </Button>
                  )}
                </View>

                <View className="gap-1.5">
                  <Text className="text-sm font-medium">Name (optional)</Text>
                  <Input
                    value={entry.peptideName}
                    onChangeText={(value) =>
                      updatePeptide({ index, field: 'peptideName', value })
                    }
                    placeholder="e.g. BPC-157"
                    returnKeyType="done"
                  />
                </View>

                <View className="gap-1.5">
                  <Text className="text-sm font-medium">Amount in vial</Text>
                  <Input
                    value={entry.peptideAmountMg}
                    onChangeText={(value) =>
                      updatePeptide({ index, field: 'peptideAmountMg', value })
                    }
                    placeholder="e.g. 5"
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                  />
                  <Text className="text-xs text-muted-foreground">mg</Text>
                </View>

                <View className="gap-1.5">
                  <Text className="text-sm font-medium">Desired dose</Text>
                  <Input
                    value={entry.desiredDose}
                    onChangeText={(value) =>
                      updatePeptide({ index, field: 'desiredDose', value })
                    }
                    placeholder={doseUnit === 'mcg' ? 'e.g. 250' : 'e.g. 0.25'}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                  />
                  {index === 0 && (
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
                      {DOSE_UNITS.map((unit, i) => (
                        <ToggleGroupItem
                          key={unit}
                          value={unit}
                          isFirst={i === 0}
                          isLast={i === DOSE_UNITS.length - 1}
                          className="flex-1"
                        >
                          <Text>{unit}</Text>
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  )}
                </View>
              </CardContent>
            </Card>
          ))}

          {/* Add peptide button */}
          <Button
            variant="default"
            onPress={addPeptide}
          >
            <Plus
              size={18}
              className="text-foreground"
            />
            <Text>Add Peptide</Text>
          </Button>

          {/* Shared water input */}
          <Card>
            <CardContent className="gap-4">
              <View className="flex-row items-center gap-3 pb-2">
                <GlowIcon
                  icon={Droplets}
                  color="teal"
                  size={18}
                />
                <Text className="text-base font-semibold">Reconstitution</Text>
              </View>

              <View className="gap-1.5">
                <Text className="text-sm font-medium">
                  Bacteriostatic water added
                </Text>
                <Input
                  value={waterVolumeMl}
                  onChangeText={setWaterVolumeMl}
                  placeholder="e.g. 2"
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                />
                <Text className="text-xs text-muted-foreground">mL</Text>
              </View>
            </CardContent>
          </Card>

          {/* Breakdown + warnings + save (only when result exists) */}
          {result && (
            <>
              <Card>
                <CardContent className="gap-2">
                  <Text className="text-sm font-semibold">Breakdown</Text>
                  {result.peptideResults.map((pr, i) => (
                    <View
                      key={peptides[i]?.key}
                      className="flex-row justify-between"
                    >
                      <Text className="text-sm text-muted-foreground">
                        {peptides[i]?.peptideName || `Peptide ${i + 1}`}
                      </Text>
                      <Text className="text-sm font-medium">
                        {pr.unitsToDraw} units
                      </Text>
                    </View>
                  ))}
                </CardContent>
              </Card>

              {result.exceedsSyringe && (
                <Card>
                  <CardContent>
                    <View className="rounded-lg bg-destructive/10 p-3">
                      <Text className="text-sm text-destructive">
                        This dose exceeds a {syringeSize}-unit syringe. Use a
                        larger syringe or adjust your reconstitution.
                      </Text>
                    </View>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </View>
      </KeyboardAwareScrollView>

      {/* Sticky preparation output */}
      <StickyOutputPanel
        bottom={bottom}
        onLayout={(e) => setStickyHeight(e.nativeEvent.layout.height)}
      >
        {result ? (
          <SyringeResult
            unitsToDraw={result.totalUnitsToDraw}
            volumeToDrawMl={result.totalVolumeMl}
            syringeSize={syringeSize}
            concentrationMcgPerMl={blendedConcentration}
            displayMode={displayMode}
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
                  Preparation Output
                </Text>
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
