import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Text } from '@/components/ui/text';
import Slider from '@react-native-community/slider';
import {
  ChevronLeft,
  Contrast,
  Palette,
  SunDim,
  SwatchBook,
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

// Color matrix helpers for Skia image filters
export const createBrightnessMatrix = (value: number): number[] => {
  return [
    value,
    0,
    0,
    0,
    0,
    0,
    value,
    0,
    0,
    0,
    0,
    0,
    value,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
  ];
};

export const createContrastMatrix = (value: number): number[] => {
  const t = (1 - value) / 2;
  return [
    value,
    0,
    0,
    0,
    t,
    0,
    value,
    0,
    0,
    t,
    0,
    0,
    value,
    0,
    t,
    0,
    0,
    0,
    1,
    0,
  ];
};

export const INVERT_MATRIX: number[] = [
  -1, 0, 0, 0, 1, 0, -1, 0, 0, 1, 0, 0, -1, 0, 1, 0, 0, 0, 1, 0,
];

export const GRAYSCALE_MATRIX: number[] = [
  0.2126, 0.7152, 0.0722, 0, 0, 0.2126, 0.7152, 0.0722, 0, 0, 0.2126, 0.7152,
  0.0722, 0, 0, 0, 0, 0, 1, 0,
];

export const IDENTITY_MATRIX: number[] = [
  1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
];

export const multiplyColorMatrices = (a: number[], b: number[]): number[] => {
  const result: number[] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 5; j++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) {
        sum += a[i * 5 + k] * b[k * 5 + j];
      }
      if (j === 4) {
        sum += a[i * 5 + 4];
      }
      result[i * 5 + j] = sum;
    }
  }
  return result;
};

// Types
type FilterType = 'brightness' | 'contrast' | 'invert' | 'grayscale' | null;

export type ImageEditToolbarProps = {
  brightness: number;
  contrast: number;
  isInverted: boolean;
  isGrayscale: boolean;
  onBrightnessChange: (value: number) => void;
  onContrastChange: (value: number) => void;
  onInvertToggle: () => void;
  onGrayscaleToggle: () => void;
  style?: StyleProp<ViewStyle>;
};

// Hook for managing image filter state
export const useImageFilters = () => {
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [isInverted, setIsInverted] = useState(false);
  const [isGrayscale, setIsGrayscale] = useState(false);

  const getColorMatrix = useCallback((): number[] => {
    let matrix = IDENTITY_MATRIX;
    matrix = multiplyColorMatrices(matrix, createBrightnessMatrix(brightness));
    matrix = multiplyColorMatrices(matrix, createContrastMatrix(contrast));
    if (isInverted) {
      matrix = multiplyColorMatrices(matrix, INVERT_MATRIX);
    }
    if (isGrayscale) {
      matrix = multiplyColorMatrices(matrix, GRAYSCALE_MATRIX);
    }
    return matrix;
  }, [brightness, contrast, isInverted, isGrayscale]);

  const reset = useCallback(() => {
    setBrightness(1);
    setContrast(1);
    setIsInverted(false);
    setIsGrayscale(false);
  }, []);

  // Props to spread into ImageEditToolbar
  const toolbarProps: ImageEditToolbarProps = {
    brightness,
    contrast,
    isInverted,
    isGrayscale,
    onBrightnessChange: setBrightness,
    onContrastChange: setContrast,
    onInvertToggle: () => setIsInverted((prev) => !prev),
    onGrayscaleToggle: () => setIsGrayscale((prev) => !prev),
  };

  return {
    brightness,
    contrast,
    isInverted,
    isGrayscale,
    setBrightness,
    setContrast,
    setIsInverted,
    setIsGrayscale,
    getColorMatrix,
    reset,
    toolbarProps,
  };
};

iconWithClassName(SunDim);
iconWithClassName(Contrast);
iconWithClassName(Palette);
iconWithClassName(SwatchBook);
iconWithClassName(ChevronLeft);

type ToolButtonProps = {
  icon: React.ReactNode;
  label: string;
  hasAdjustment: boolean;
  onPress: () => void;
};

const ToolButton = ({
  icon,
  label,
  hasAdjustment,
  onPress,
}: ToolButtonProps) => (
  <Pressable
    onPress={onPress}
    className="items-center"
    style={{ width: 80 }}
  >
    <Text className="text-white text-xs mb-2">{label}</Text>
    <View
      className="items-center justify-center rounded-full border border-white/30"
      style={{ width: 64, height: 64 }}
    >
      {icon}
    </View>
    <View
      className="w-1 h-1 rounded-full bg-white/60 mt-2"
      style={{ opacity: hasAdjustment ? 1 : 0 }}
    />
  </Pressable>
);

export const ImageEditToolbar = ({
  brightness,
  contrast,
  isInverted,
  isGrayscale,
  onBrightnessChange,
  onContrastChange,
  onInvertToggle,
  onGrayscaleToggle,
  style,
}: ImageEditToolbarProps) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);

  const handleFilterPress = (filter: FilterType) => {
    if (filter === 'invert') {
      onInvertToggle();
      return;
    }
    if (filter === 'grayscale') {
      onGrayscaleToggle();
      return;
    }
    setActiveFilter(filter);
  };

  const handleBack = () => {
    setActiveFilter(null);
  };

  const getSliderConfig = () => {
    switch (activeFilter) {
      case 'brightness':
        return {
          value: brightness,
          onChange: onBrightnessChange,
          label: t('imageEdit.brightness'),
          // Display as -100 to +100 centered at 0
          displayValue: Math.round((brightness - 1) * 100),
        };
      case 'contrast':
        return {
          value: contrast,
          onChange: onContrastChange,
          label: t('imageEdit.contrast'),
          displayValue: Math.round((contrast - 1) * 100),
        };
      default:
        return null;
    }
  };

  const sliderConfig = getSliderConfig();

  // Shared container height for consistent layout
  const TOOLBAR_HEIGHT = 140;

  // Slider detail view
  if (sliderConfig) {
    return (
      <View
        className="bg-black rounded-t-3xl justify-center"
        style={[{ height: TOOLBAR_HEIGHT }, style]}
      >
        {/* Header with back button and title */}
        <View className="flex-row items-center px-4 mb-2">
          <Pressable
            onPress={handleBack}
            className="p-2 -ml-2"
            hitSlop={16}
          >
            <ChevronLeft
              size={24}
              color="#ffffff"
            />
          </Pressable>
          <Text className="text-white text-base font-medium flex-1 text-center pr-8">
            {sliderConfig.label}
          </Text>
        </View>

        {/* Slider with value */}
        <View className="px-6">
          <View className="items-end mb-1">
            <Text className="text-white text-sm">
              {sliderConfig.displayValue}
            </Text>
          </View>
          <View className="relative">
            {/* Center marker */}
            <View
              className="absolute w-px h-2 bg-white/40"
              style={{ left: '50%', top: -4, marginLeft: -0.5 }}
            />
            <Slider
              minimumValue={0}
              maximumValue={2}
              value={sliderConfig.value}
              onValueChange={sliderConfig.onChange}
              minimumTrackTintColor="#ffffff"
              maximumTrackTintColor="rgba(255,255,255,0.3)"
              thumbTintColor="#ffffff"
            />
          </View>
        </View>
      </View>
    );
  }

  // Tool selection view
  return (
    <View
      className="bg-black rounded-t-3xl justify-center"
      style={[{ height: TOOLBAR_HEIGHT }, style]}
    >
      {/* Scrollable tool icons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 8,
          alignItems: 'center',
        }}
      >
        <ToolButton
          icon={
            <SunDim
              size={28}
              color="#ffffff"
            />
          }
          label={t('imageEdit.brightness')}
          hasAdjustment={Math.round((brightness - 1) * 100) !== 0}
          onPress={() => handleFilterPress('brightness')}
        />

        <ToolButton
          icon={
            <Contrast
              size={28}
              color="#ffffff"
            />
          }
          label={t('imageEdit.contrast')}
          hasAdjustment={Math.round((contrast - 1) * 100) !== 0}
          onPress={() => handleFilterPress('contrast')}
        />

        <ToolButton
          icon={
            <Palette
              size={28}
              color={isInverted ? '#ffffff' : '#888888'}
            />
          }
          label={t('imageEdit.invert')}
          hasAdjustment={isInverted}
          onPress={() => handleFilterPress('invert')}
        />

        <ToolButton
          icon={
            <SwatchBook
              size={28}
              color={isGrayscale ? '#ffffff' : '#888888'}
            />
          }
          label={t('imageEdit.bw')}
          hasAdjustment={isGrayscale}
          onPress={() => handleFilterPress('grayscale')}
        />
      </ScrollView>
    </View>
  );
};
