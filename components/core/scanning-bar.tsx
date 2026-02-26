import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

export const ScanningBar = ({
  cameraViewHeight,
  isScanning,
}: {
  cameraViewHeight: number;
  isScanning: boolean;
}) => {
  const scanningAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isScanning && cameraViewHeight > 0) {
      const startScanning = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(scanningAnimation, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(scanningAnimation, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };
      startScanning();
    } else {
      scanningAnimation.stopAnimation();
      scanningAnimation.setValue(0);
    }
  }, [isScanning, scanningAnimation, cameraViewHeight]);

  if (!isScanning) {
    return null;
  }

  return (
    <>
      {/* Dramatic trailing gradient effect */}
      <Animated.View
        className="absolute left-0 right-0"
        style={{
          height: cameraViewHeight * 0.3, // Trail covers 30% of screen height
          transform: [
            {
              translateY: scanningAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  0 - (cameraViewHeight * 0.3) / 2,
                  cameraViewHeight - 4 - (cameraViewHeight * 0.3) / 2,
                ],
              }),
            },
          ],
        }}
      >
        <LinearGradient
          pointerEvents="none"
          colors={[
            'transparent',
            'rgba(34, 211, 238, 0.1)',
            'rgba(34, 211, 238, 0.4)',
            'rgba(34, 211, 238, 0.8)',
            'rgba(34, 211, 238, 0.4)',
            'rgba(34, 211, 238, 0.1)',
            'transparent',
          ]}
          style={{
            flex: 1,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>

      {/* Main scanning bar */}
      <Animated.View
        className="absolute left-0 right-0 h-2 bg-cyan-400"
        style={{
          transform: [
            {
              translateY: scanningAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, cameraViewHeight - 4],
              }),
            },
          ],
          shadowColor: '#22d3ee',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1.0,
          shadowRadius: 8,
          elevation: 10,
        }}
      />

      {/* Optional: Add a subtle overlay to indicate scanning mode */}
      <View className="absolute inset-0 bg-black/10" />
    </>
  );
};
