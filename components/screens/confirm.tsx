import { CropOverlay, CropRegion } from '@/components/core/crop-overlay';
import { HeaderSubmitButton } from '@/components/core/header-button';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import {
  ImageEditToolbar,
  useImageFilters,
} from '@/components/image-edit-toolbar';
import { ImageZoomModal } from '@/components/image-zoom-modal';
import { CONFIG } from '@/config';
import {
  Canvas,
  ColorMatrix,
  Skia,
  Image as SkiaImage,
  useImage,
} from '@shopify/react-native-skia';
import { File, Paths } from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { useNavigation } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

iconWithClassName(Sparkles);

const TAB_BAR_HEIGHT = 49;

type ConfirmScreenProps = {
  photoUri: string;
  cropRegion?: CropRegion;
  onAnalyze: (processedImageUri: string) => void;
  photoEditingDisabled?: boolean;
  croppingDisabled?: boolean;
};

export const ConfirmScreen = ({
  photoUri,
  cropRegion,
  onAnalyze,
  photoEditingDisabled,
  croppingDisabled,
}: ConfirmScreenProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZoomModalVisible, setIsZoomModalVisible] = useState(false);
  const [croppedUri, setCroppedUri] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(!!cropRegion);
  const [pendingCropRegion, setPendingCropRegion] = useState<
    CropRegion | undefined
  >();
  const { bottom } = useSafeAreaInsets();

  // Image filters
  const { getColorMatrix, toolbarProps } = useImageFilters();

  // Crop the image on mount if crop region is provided
  useEffect(() => {
    const cropImage = async () => {
      if (!cropRegion) {
        setCroppedUri(photoUri);
        setIsCropping(false);
        return;
      }

      try {
        // Get actual image dimensions first
        const imageContext = ImageManipulator.manipulate(photoUri);
        const imageInfo = await imageContext.renderAsync();
        const imageWidth = imageInfo.width;
        const imageHeight = imageInfo.height;

        // Clamp crop region to image bounds
        const originX = Math.round(
          Math.max(0, Math.min(cropRegion.x, imageWidth - 1))
        );
        const originY = Math.round(
          Math.max(0, Math.min(cropRegion.y, imageHeight - 1))
        );
        const maxWidth = imageWidth - originX;
        const maxHeight = imageHeight - originY;
        const width = Math.round(
          Math.max(1, Math.min(cropRegion.width, maxWidth))
        );
        const height = Math.round(
          Math.max(1, Math.min(cropRegion.height, maxHeight))
        );

        const context = ImageManipulator.manipulate(photoUri);
        context.crop({
          originX,
          originY,
          width,
          height,
        });

        const image = await context.renderAsync();
        const result = await image.saveAsync({
          format: SaveFormat.JPEG,
          compress: 0.9,
        });

        setCroppedUri(result.uri);
      } catch (error) {
        console.error('Failed to crop image:', error);
        setCroppedUri(photoUri); // Fallback to original
      } finally {
        setIsCropping(false);
      }
    };

    void cropImage();
  }, [photoUri, cropRegion]);

  // Use cropped URI for display
  const displayUri = croppedUri || photoUri;

  // Load image with Skia
  const skiaImage = useImage(displayUri);

  // Track canvas dimensions for proper image sizing
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const getImageDimensions = () => {
    if (!skiaImage || canvasSize.width === 0)
      return { width: canvasSize.width, height: canvasSize.height, x: 0, y: 0 };

    const imageAspect = skiaImage.width() / skiaImage.height();
    const canvasAspect = canvasSize.width / canvasSize.height;

    let width, height, x, y;

    if (imageAspect > canvasAspect) {
      width = canvasSize.width;
      height = canvasSize.width / imageAspect;
      x = 0;
      y = (canvasSize.height - height) / 2;
    } else {
      height = canvasSize.height;
      width = canvasSize.height * imageAspect;
      x = (canvasSize.width - width) / 2;
      y = 0;
    }

    return { width, height, x, y };
  };

  const imageDimensions = getImageDimensions();

  const handleAnalyze = useCallback(async () => {
    if (!displayUri || !skiaImage) {
      Alert.alert(t('common.error'), t('confirm.noPhotoToAnalyze'));
      return;
    }

    if (isProcessing || isCropping) {
      return;
    }

    setIsProcessing(true);

    try {
      let processedImageUri = displayUri;

      // Apply pending crop if there is one
      if (pendingCropRegion && imageDimensions.width > 0) {
        const scaleX = skiaImage.width() / imageDimensions.width;
        const scaleY = skiaImage.height() / imageDimensions.height;
        const imageWidth = skiaImage.width();
        const imageHeight = skiaImage.height();

        // Calculate scaled values and clamp to image bounds
        const originX = Math.round(
          Math.max(0, Math.min(pendingCropRegion.x * scaleX, imageWidth - 1))
        );
        const originY = Math.round(
          Math.max(0, Math.min(pendingCropRegion.y * scaleY, imageHeight - 1))
        );
        const maxWidth = imageWidth - originX;
        const maxHeight = imageHeight - originY;
        const width = Math.round(
          Math.max(1, Math.min(pendingCropRegion.width * scaleX, maxWidth))
        );
        const height = Math.round(
          Math.max(1, Math.min(pendingCropRegion.height * scaleY, maxHeight))
        );

        const imageCropRegion = {
          originX,
          originY,
          width,
          height,
        };

        const context = ImageManipulator.manipulate(processedImageUri);
        context.crop(imageCropRegion);

        const image = await context.renderAsync();
        const result = await image.saveAsync({
          format: SaveFormat.JPEG,
          compress: 0.9,
        });

        processedImageUri = result.uri;
      }

      // Only apply image filters if editing is not disabled
      if (!photoEditingDisabled) {
        // Create offscreen surface at original image dimensions
        const width = skiaImage.width();
        const height = skiaImage.height();
        const surface = Skia.Surface.MakeOffscreen(width, height);

        if (!surface) {
          throw new Error('Failed to create offscreen surface');
        }

        const canvas = surface.getCanvas();

        // Create paint with color matrix filter
        const paint = Skia.Paint();
        const colorMatrix = getColorMatrix();
        const colorFilter = Skia.ColorFilter.MakeMatrix(colorMatrix);
        paint.setColorFilter(colorFilter);

        // Draw the image with the filter
        canvas.drawImage(skiaImage, 0, 0, paint);

        // Get the filtered image
        const filteredImage = surface.makeImageSnapshot();
        const imageData = filteredImage.encodeToBase64();

        // Save filtered image to document directory (persistent storage)
        const filteredFile = new File(
          Paths.cache,
          `filtered-${Date.now()}.jpg`
        );
        filteredFile.write(imageData, { encoding: 'base64' });
        processedImageUri = filteredFile.uri;
      }

      onAnalyze(processedImageUri);
    } catch (error) {
      setIsProcessing(false);
      Alert.alert(t('common.error'), t('confirm.failedToProcessImage'));
      console.error(error);
    }
  }, [
    displayUri,
    skiaImage,
    getColorMatrix,
    onAnalyze,
    isProcessing,
    isCropping,
    photoEditingDisabled,
    pendingCropRegion,
    imageDimensions,
    t,
  ]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderSubmitButton
          onPress={handleAnalyze}
          title={t('confirm.analyze')}
          titleClassName="text-white"
          buttonClassName={
            Platform.OS === 'android'
              ? 'bg-transparent border border-border active:bg-zinc-700'
              : undefined
          }
          loading={isProcessing || isCropping}
          icon={
            <Sparkles
              size={CONFIG.icon.size.sm}
              color="white"
            />
          }
        />
      ),
    });
  }, [navigation, isProcessing, isCropping, handleAnalyze, t]);

  return (
    <View
      className="flex-1 bg-black"
      onLayout={(e) => {
        setCanvasSize({
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        });
      }}
    >
      {skiaImage && canvasSize.width > 0 && (
        <Pressable
          style={{ flex: 1 }}
          onPress={() => {
            if (croppingDisabled) {
              void Haptics.selectionAsync();
              setIsZoomModalVisible(true);
            }
          }}
        >
          <Canvas style={{ flex: 1 }}>
            <SkiaImage
              image={skiaImage}
              x={imageDimensions.x}
              y={imageDimensions.y}
              width={imageDimensions.width}
              height={imageDimensions.height}
            >
              <ColorMatrix matrix={getColorMatrix()} />
            </SkiaImage>
          </Canvas>
          {!croppingDisabled && (
            <View
              style={{
                position: 'absolute',
                left: imageDimensions.x,
                top: imageDimensions.y,
                width: imageDimensions.width,
                height: imageDimensions.height,
              }}
            >
              <CropOverlay
                onCropChange={setPendingCropRegion}
                fillContainer
              />
            </View>
          )}
        </Pressable>
      )}

      {/* Toolbar wrapper - takes full space, toolbar at bottom */}
      {!photoEditingDisabled && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'flex-end',
            paddingBottom: bottom + TAB_BAR_HEIGHT,
            backgroundColor: 'black',
          }}
          pointerEvents="box-none"
        >
          <ImageEditToolbar {...toolbarProps} />
        </View>
      )}

      {/* Zoom modal */}
      <ImageZoomModal
        visible={isZoomModalVisible}
        uri={displayUri}
        onClose={() => setIsZoomModalVisible(false)}
      />
    </View>
  );
};
