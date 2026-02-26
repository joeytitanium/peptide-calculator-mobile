import { IMAGE_ASSETS, ImageAssetName } from '@/components/assets';
import { PhoneFrameScreenshot } from '@/components/phone-frame-screenshot';
import { useColorScheme } from '@/lib/use-color-scheme';
import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, View, useWindowDimensions } from 'react-native';

export const OnboardingHeroImage = ({
  source,
  className,
}: {
  source: ImageAssetName;
  className?: string;
}) => {
  const { isDarkColorScheme } = useColorScheme();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const imagePath = IMAGE_ASSETS[source];
  const resolvedAssetSource = Image.resolveAssetSource(imagePath);
  let imageAspectRatio = 1;
  if (
    resolvedAssetSource.width &&
    resolvedAssetSource.height &&
    resolvedAssetSource.height !== 0
  ) {
    imageAspectRatio = resolvedAssetSource.width / resolvedAssetSource.height;
  }

  const width = windowWidth * 0.85;
  const height = width / imageAspectRatio;
  const parentContainerHeight = windowHeight * 0.5;

  return (
    <View
      className={clsx('mb-10 items-center overflow-hidden', className)}
      style={{
        height: parentContainerHeight,
      }}
    >
      <View
        className="absolute"
        style={{
          width,
          height,
          top: 30,
        }}
      >
        <PhoneFrameScreenshot source={source} />
      </View>

      <LinearGradient
        pointerEvents="none"
        colors={
          isDarkColorScheme
            ? ['rgba(0,0,0,0)', 'rgba(0,0,0,1)']
            : ['rgba(255,255,255,0)', 'rgba(255,255,255,1)']
        }
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
          zIndex: 1, // Ensure gradient is above the image border wrapper
        }}
      />
    </View>
  );
};
