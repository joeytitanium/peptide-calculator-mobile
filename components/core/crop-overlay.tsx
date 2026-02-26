import { useCallback, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, Mask, Rect } from 'react-native-svg';

const CORNER_SIZE = 52;
const CORNER_HIT_SLOP = 20;
const MIN_CROP_SIZE = 100;
const BORDER_RADIUS = 16;
const DIM_OPACITY = 0.6;
const EDGE_PADDING = 32;

export type CropRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CropOverlayProps = {
  onCropChange?: (region: CropRegion) => void;
  initialPadding?: number;
  fillContainer?: boolean;
  initialRegion?: CropRegion;
};

export const CropOverlay = ({
  onCropChange,
  initialPadding = 40,
  fillContainer = false,
  initialRegion,
}: CropOverlayProps) => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Crop region as shared values for smooth animations
  const cropX = useSharedValue(initialPadding);
  const cropY = useSharedValue(initialPadding);
  const cropWidth = useSharedValue(0);
  const cropHeight = useSharedValue(0);

  // Track starting values for gestures
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const startWidth = useSharedValue(0);
  const startHeight = useSharedValue(0);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      setContainerSize({ width, height });

      let initialX: number;
      let initialY: number;
      let initialWidth: number;
      let initialHeight: number;

      if (initialRegion) {
        // Use provided initial region, clamped to current container bounds
        initialX = Math.max(
          EDGE_PADDING,
          Math.min(initialRegion.x, width - MIN_CROP_SIZE)
        );
        initialY = Math.max(
          EDGE_PADDING,
          Math.min(initialRegion.y, height - MIN_CROP_SIZE)
        );
        initialWidth = Math.max(
          MIN_CROP_SIZE,
          Math.min(initialRegion.width, width - EDGE_PADDING - initialX)
        );
        initialHeight = Math.max(
          MIN_CROP_SIZE,
          Math.min(initialRegion.height, height - EDGE_PADDING - initialY)
        );
      } else if (fillContainer) {
        // Fill the container with edge padding
        initialX = EDGE_PADDING;
        initialY = EDGE_PADDING;
        initialWidth = width - EDGE_PADDING * 2;
        initialHeight = height - EDGE_PADDING * 2;
      } else {
        // Initialize crop region with landscape aspect ratio (16:9)
        const maxWidth = width - initialPadding * 2;
        initialWidth = maxWidth;
        initialHeight = initialWidth * (9 / 16); // 16:9 landscape
        initialX = initialPadding;
        initialY = (height - initialHeight) / 2; // Center vertically
      }

      cropX.value = initialX;
      cropY.value = initialY;
      cropWidth.value = initialWidth;
      cropHeight.value = initialHeight;

      setDisplayCrop({
        x: initialX,
        y: initialY,
        width: initialWidth,
        height: initialHeight,
      });

      onCropChange?.({
        x: initialX,
        y: initialY,
        width: initialWidth,
        height: initialHeight,
      });
    },
    [
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      initialPadding,
      fillContainer,
      initialRegion,
      onCropChange,
    ]
  );

  const notifyCropChange = useCallback(() => {
    onCropChange?.({
      x: cropX.value,
      y: cropY.value,
      width: cropWidth.value,
      height: cropHeight.value,
    });
  }, [cropX, cropY, cropWidth, cropHeight, onCropChange]);

  const onGestureUpdate = useCallback(() => {
    setDisplayCrop({
      x: cropX.value,
      y: cropY.value,
      width: cropWidth.value,
      height: cropHeight.value,
    });
  }, [cropX, cropY, cropWidth, cropHeight]);

  // Top-left corner gesture
  const topLeftGesture = Gesture.Pan()
    .runOnJS(true)
    .onStart(() => {
      startX.value = cropX.value;
      startY.value = cropY.value;
      startWidth.value = cropWidth.value;
      startHeight.value = cropHeight.value;
    })
    .onUpdate((event) => {
      const newX = Math.max(EDGE_PADDING, startX.value + event.translationX);
      const newY = Math.max(EDGE_PADDING, startY.value + event.translationY);
      const maxX = startX.value + startWidth.value - MIN_CROP_SIZE;
      const maxY = startY.value + startHeight.value - MIN_CROP_SIZE;

      cropX.value = Math.min(newX, maxX);
      cropY.value = Math.min(newY, maxY);
      cropWidth.value = startWidth.value - (cropX.value - startX.value);
      cropHeight.value = startHeight.value - (cropY.value - startY.value);
    })
    .onEnd(notifyCropChange)
    .onChange(onGestureUpdate);

  // Top-right corner gesture
  const topRightGesture = Gesture.Pan()
    .runOnJS(true)
    .onStart(() => {
      startX.value = cropX.value;
      startY.value = cropY.value;
      startWidth.value = cropWidth.value;
      startHeight.value = cropHeight.value;
    })
    .onUpdate((event) => {
      const newWidth = Math.max(
        MIN_CROP_SIZE,
        Math.min(
          containerSize.width - EDGE_PADDING - startX.value,
          startWidth.value + event.translationX
        )
      );
      const newY = Math.max(EDGE_PADDING, startY.value + event.translationY);
      const maxY = startY.value + startHeight.value - MIN_CROP_SIZE;

      cropY.value = Math.min(newY, maxY);
      cropWidth.value = newWidth;
      cropHeight.value = startHeight.value - (cropY.value - startY.value);
    })
    .onEnd(notifyCropChange)
    .onChange(onGestureUpdate);

  // Bottom-left corner gesture
  const bottomLeftGesture = Gesture.Pan()
    .runOnJS(true)
    .onStart(() => {
      startX.value = cropX.value;
      startY.value = cropY.value;
      startWidth.value = cropWidth.value;
      startHeight.value = cropHeight.value;
    })
    .onUpdate((event) => {
      const newX = Math.max(EDGE_PADDING, startX.value + event.translationX);
      const maxX = startX.value + startWidth.value - MIN_CROP_SIZE;
      const newHeight = Math.max(
        MIN_CROP_SIZE,
        Math.min(
          containerSize.height - EDGE_PADDING - startY.value,
          startHeight.value + event.translationY
        )
      );

      cropX.value = Math.min(newX, maxX);
      cropWidth.value = startWidth.value - (cropX.value - startX.value);
      cropHeight.value = newHeight;
    })
    .onEnd(notifyCropChange)
    .onChange(onGestureUpdate);

  // Bottom-right corner gesture
  const bottomRightGesture = Gesture.Pan()
    .runOnJS(true)
    .onStart(() => {
      startX.value = cropX.value;
      startY.value = cropY.value;
      startWidth.value = cropWidth.value;
      startHeight.value = cropHeight.value;
    })
    .onUpdate((event) => {
      const newWidth = Math.max(
        MIN_CROP_SIZE,
        Math.min(
          containerSize.width - EDGE_PADDING - startX.value,
          startWidth.value + event.translationX
        )
      );
      const newHeight = Math.max(
        MIN_CROP_SIZE,
        Math.min(
          containerSize.height - EDGE_PADDING - startY.value,
          startHeight.value + event.translationY
        )
      );

      cropWidth.value = newWidth;
      cropHeight.value = newHeight;
    })
    .onEnd(notifyCropChange)
    .onChange(onGestureUpdate);

  // We'll use state-based rendering for SVG since it doesn't support animated values directly
  const [displayCrop, setDisplayCrop] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Update display crop when shared values change
  const updateDisplayCrop = useCallback(() => {
    setDisplayCrop({
      x: cropX.value,
      y: cropY.value,
      width: cropWidth.value,
      height: cropHeight.value,
    });
  }, [cropX, cropY, cropWidth, cropHeight]);

  // Corner handle styles
  const topLeftCornerStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: cropX.value - CORNER_SIZE / 2,
    top: cropY.value - CORNER_SIZE / 2,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  }));

  const topRightCornerStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: cropX.value + cropWidth.value - CORNER_SIZE / 2,
    top: cropY.value - CORNER_SIZE / 2,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  }));

  const bottomLeftCornerStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: cropX.value - CORNER_SIZE / 2,
    top: cropY.value + cropHeight.value - CORNER_SIZE / 2,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  }));

  const bottomRightCornerStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: cropX.value + cropWidth.value - CORNER_SIZE / 2,
    top: cropY.value + cropHeight.value - CORNER_SIZE / 2,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  }));

  return (
    <View
      style={StyleSheet.absoluteFill}
      onLayout={onLayout}
      pointerEvents="box-none"
    >
      {containerSize.width > 0 && displayCrop.width > 0 && (
        <>
          {/* SVG overlay with rounded rectangle cutout */}
          <Svg
            width={containerSize.width}
            height={containerSize.height}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          >
            <Defs>
              <Mask id="cropMask">
                <Rect
                  x={0}
                  y={0}
                  width={containerSize.width}
                  height={containerSize.height}
                  fill="white"
                />
                <Rect
                  x={displayCrop.x}
                  y={displayCrop.y}
                  width={displayCrop.width}
                  height={displayCrop.height}
                  rx={BORDER_RADIUS}
                  ry={BORDER_RADIUS}
                  fill="black"
                />
              </Mask>
            </Defs>
            <Rect
              x={0}
              y={0}
              width={containerSize.width}
              height={containerSize.height}
              fill={`rgba(0, 0, 0, ${DIM_OPACITY})`}
              mask="url(#cropMask)"
            />
          </Svg>

          {/* Corner handles */}
          <GestureDetector gesture={topLeftGesture}>
            <Animated.View
              style={topLeftCornerStyle}
              hitSlop={CORNER_HIT_SLOP}
            >
              <View style={styles.cornerTopLeft} />
            </Animated.View>
          </GestureDetector>

          <GestureDetector gesture={topRightGesture}>
            <Animated.View
              style={topRightCornerStyle}
              hitSlop={CORNER_HIT_SLOP}
            >
              <View style={styles.cornerTopRight} />
            </Animated.View>
          </GestureDetector>

          <GestureDetector gesture={bottomLeftGesture}>
            <Animated.View
              style={bottomLeftCornerStyle}
              hitSlop={CORNER_HIT_SLOP}
            >
              <View style={styles.cornerBottomLeft} />
            </Animated.View>
          </GestureDetector>

          <GestureDetector gesture={bottomRightGesture}>
            <Animated.View
              style={bottomRightCornerStyle}
              hitSlop={CORNER_HIT_SLOP}
            >
              <View style={styles.cornerBottomRight} />
            </Animated.View>
          </GestureDetector>
        </>
      )}
    </View>
  );
};

const CORNER_BORDER_WIDTH = 3;
const CORNER_LENGTH = 28;

const styles = StyleSheet.create({
  cornerTopLeft: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: CORNER_LENGTH,
    height: CORNER_LENGTH,
    borderLeftWidth: CORNER_BORDER_WIDTH,
    borderTopWidth: CORNER_BORDER_WIDTH,
    borderTopLeftRadius: BORDER_RADIUS,
    borderColor: 'white',
  },
  cornerTopRight: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: CORNER_LENGTH,
    height: CORNER_LENGTH,
    borderRightWidth: CORNER_BORDER_WIDTH,
    borderTopWidth: CORNER_BORDER_WIDTH,
    borderTopRightRadius: BORDER_RADIUS,
    borderColor: 'white',
  },
  cornerBottomLeft: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: CORNER_LENGTH,
    height: CORNER_LENGTH,
    borderLeftWidth: CORNER_BORDER_WIDTH,
    borderBottomWidth: CORNER_BORDER_WIDTH,
    borderBottomLeftRadius: BORDER_RADIUS,
    borderColor: 'white',
  },
  cornerBottomRight: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CORNER_LENGTH,
    height: CORNER_LENGTH,
    borderRightWidth: CORNER_BORDER_WIDTH,
    borderBottomWidth: CORNER_BORDER_WIDTH,
    borderBottomRightRadius: BORDER_RADIUS,
    borderColor: 'white',
  },
});
