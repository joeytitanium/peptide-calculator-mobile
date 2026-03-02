import { GlowIcon } from '@/components/core/glow-icon';
import { StickyOutputPanel } from '@/components/app-specific/sticky-output-panel';
import { SyringeResult } from '@/components/core/syringe-result';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useSafeAreaInsets } from '@/hooks/use-safe-area-insets';
import type {
  SyringeDisplayMode,
  SyringeSize,
} from '@/types/app-specific/calculation';
import {
  SYRINGE_DISPLAY_MODES,
  SYRINGE_SIZES,
} from '@/types/app-specific/calculation';
import {
  calculatePeptideDose,
  parseNumericInput,
} from '@/utils/app-specific/calculator-math';
import { FlaskConical, Syringe as SyringeIcon } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

iconWithClassName(SyringeIcon);
iconWithClassName(FlaskConical);

const DISPLAY_MODE_LABELS: Record<SyringeDisplayMode, string> = {
  units: 'Units',
  ml: 'mL',
};

export function CalculatorScreen() {
  const { paddingTop, bottom } = useSafeAreaInsets({
    navigationBarPadding: 'none',
    nativePadding: 'none',
  });

  const [peptideAmountMg, setPeptideAmountMg] = useState('5');
  const [waterVolumeMl, setWaterVolumeMl] = useState('2');
  const [desiredDoseMcg, setDesiredDoseMcg] = useState('250');
  const [syringeSize, setSyringeSize] = useState<SyringeSize>(100);
  const [displayMode, setDisplayMode] = useState<SyringeDisplayMode>('units');
  const [stickyHeight, setStickyHeight] = useState(0);

  const result = useMemo(() => {
    const peptide = parseNumericInput(peptideAmountMg);
    const water = parseNumericInput(waterVolumeMl);
    const dose = parseNumericInput(desiredDoseMcg);

    if (isNaN(peptide) || isNaN(water) || isNaN(dose)) {
      return null;
    }

    return calculatePeptideDose({
      peptideAmountMg: peptide,
      waterVolumeMl: water,
      desiredDoseMcg: dose,
      syringeSize,
    });
  }, [peptideAmountMg, waterVolumeMl, desiredDoseMcg, syringeSize]);

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

              <View className="gap-1.5">
                <Text className="text-sm font-medium">Desired dose</Text>
                <Input
                  value={desiredDoseMcg}
                  onChangeText={setDesiredDoseMcg}
                  placeholder="e.g. 250"
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                />
                <Text className="text-xs text-muted-foreground">mcg</Text>
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
