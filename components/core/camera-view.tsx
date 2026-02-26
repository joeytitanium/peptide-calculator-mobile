import { iconWithClassName } from '@/components/icons/iconWithClassName';
import {
  PhotoGuidelines,
  PhotoGuidelinesModal,
} from '@/components/photo-guidelines';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { useAsyncStorage } from '@/providers/async-storage-provider';
import { clsx } from 'clsx';
import {
  CameraView as ExpoCameraView,
  useCameraPermissions,
} from 'expo-camera';
import { GlassView } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image, Info, Scan } from 'lucide-react-native';
import { ReactNode, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CropOverlay, CropRegion } from './crop-overlay';

iconWithClassName(Camera);
iconWithClassName(Image);
iconWithClassName(Info);
iconWithClassName(Scan);

const CameraViewContainer = ({
  className,
  children,
  style,
}: {
  className?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View
      className={clsx('flex-1 bg-background', className)}
      style={style}
    >
      {children}
    </View>
  );
};

const ZOOM_LEVELS = [0, 0.1, 0.275, 0.5, 0.75];
type ZoomLevel = (typeof ZOOM_LEVELS)[number];
const ZOOM_LEVEL_LABELS: Record<ZoomLevel, string> = {
  0: '1',
  0.1: '2',
  0.275: '5',
  0.5: '8',
  0.75: '15',
};

export { CropRegion };

export const CameraView = ({
  containerClassName,
  cameraViewSlot,
  onPhotoTaken,
  active,
  photoGuidelinesDisabled,
  cropEnabled = false,
  style,
}: {
  active?: boolean;
  containerClassName?: string;
  onPhotoTaken?: (uri: string, cropRegion?: CropRegion) => void;
  cameraViewSlot?: ReactNode;
  photoGuidelinesDisabled?: boolean;
  cropEnabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) => {
  const { t } = useTranslation();
  const ref = useRef<ExpoCameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const { bottom } = useSafeAreaInsets();
  const [zoom, setZoom] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasViewedGuidelines, setHasViewedGuidelines] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const [cropRegion, setCropRegion] = useState<CropRegion | undefined>();
  const [cameraViewSize, setCameraViewSize] = useState({ width: 0, height: 0 });

  const { cropRegionPreferenceValue, cropRegionPreferenceSetValue } =
    useAsyncStorage();

  const handleCropChange = useCallback(
    (region: CropRegion) => {
      setCropRegion(region);
      cropRegionPreferenceSetValue(region);
    },
    [cropRegionPreferenceSetValue]
  );

  const showImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      // For image picker, pass undefined crop region (user can crop after)
      onPhotoTaken?.(result.assets[0].uri, undefined);
    }
  };

  if (!cameraPermission) {
    // Camera permissions are still loading.
    return (
      <CameraViewContainer
        className={containerClassName}
        style={style}
      >
        <Text>{t('camera.loading')}</Text>
      </CameraViewContainer>
    );
  }

  if (!cameraPermission.granted) {
    // COMMENTED OUT FOR NOW - Show photo guidelines first, then permission request
    // Keeping for future use in boilerplate
    if (!photoGuidelinesDisabled && !hasViewedGuidelines) {
      return (
        <CameraViewContainer
          className={containerClassName}
          style={style}
        >
          <PhotoGuidelines onComplete={() => setHasViewedGuidelines(true)} />
        </CameraViewContainer>
      );
    }

    // Camera permissions are not granted yet.
    return (
      <CameraViewContainer
        className={clsx('items-center justify-center px-4', containerClassName)}
        style={style}
      >
        <Card className="max-w-xs justify-center">
          <CardHeader>
            <View className="mb-4 flex flex-row items-center justify-center">
              <Camera
                size={CONFIG.icon.size.lg}
                className="text-primary"
              />
            </View>
            <CardTitle className="text-center">
              {t('camera.permissionTitle')}
            </CardTitle>
            <CardDescription className="text-md mt-1 text-center">
              {t('camera.permissionMessage')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onPress={requestCameraPermission}
              className="mt-4"
            >
              <Text>{t('camera.continue')}</Text>
            </Button>
          </CardContent>
        </Card>
      </CameraViewContainer>
    );
  }

  const onTakePhoto = async () => {
    if (!isReady) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri && cropEnabled && cropRegion && cameraViewSize.width > 0) {
      // Convert crop region from view coordinates to image coordinates
      const scaleX = photo.width / cameraViewSize.width;
      const scaleY = photo.height / cameraViewSize.height;

      const imageCropRegion: CropRegion = {
        x: cropRegion.x * scaleX,
        y: cropRegion.y * scaleY,
        width: cropRegion.width * scaleX,
        height: cropRegion.height * scaleY,
      };

      onPhotoTaken?.(photo.uri, imageCropRegion);
    } else if (photo?.uri) {
      onPhotoTaken?.(photo.uri, undefined);
    }
  };

  return (
    <CameraViewContainer style={style}>
      <View
        className="flex-1"
        onLayout={(e) => {
          setCameraViewSize({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
          });
        }}
      >
        <ExpoCameraView
          ref={ref}
          active={active ?? true}
          zoom={zoom}
          onCameraReady={() => setIsReady(true)}
          style={{
            flex: 1,
          }}
        />
        {cropEnabled ? (
          <CropOverlay
            onCropChange={handleCropChange}
            initialPadding={20}
            initialRegion={cropRegionPreferenceValue ?? undefined}
          />
        ) : (
          <View className="absolute inset-0 items-center justify-center">
            <View className="aspect-square w-[90%] items-center justify-center">
              <Scan
                className="h-full w-full text-white shadow"
                size="100%"
                strokeWidth={0.35}
              />
            </View>
          </View>
        )}
        <View className="absolute bottom-4 left-0 right-0 h-[44px] flex-row items-center justify-center">
          <GlassView
            glassEffectStyle="clear"
            style={{
              flexDirection: 'row',
              gap: 12,
              borderRadius: 100,
              paddingHorizontal: 8,
              paddingVertical: 4,
              alignItems: 'center',
            }}
          >
            {ZOOM_LEVELS.map((level) => (
              <Pressable
                key={level}
                onPress={() => {
                  void Haptics.selectionAsync();
                  setZoom(level);
                }}
              >
                <Button
                  key={level}
                  className={clsx('rounded-full bg-black/80 opacity-70', {
                    'h-[30px] w-[30px]': zoom !== level,
                  })}
                  size="icon"
                  variant="secondary"
                  onPress={() => setZoom(level)}
                >
                  <Text
                    className={clsx('', {
                      '!text-lg font-bold text-white': zoom === level,
                      '!text-sm text-white/80': zoom !== level,
                    })}
                  >
                    {ZOOM_LEVEL_LABELS[level]}
                    {zoom === level ? 'x' : ''}
                  </Text>
                </Button>
              </Pressable>
            ))}
          </GlassView>
        </View>
        {cameraViewSlot}
      </View>
      <View
        className="h-[200px] items-center justify-center bg-background/70"
        style={{
          paddingBottom: bottom + 48,
        }}
      >
        <View className="flex w-full flex-row items-center justify-between px-10">
          <Button
            variant="ghost"
            size="icon"
            onPress={showImagePicker}
          >
            <Image
              size={CONFIG.icon.size.lg}
              className="text-primary"
              strokeWidth={1.5}
            />
          </Button>
          <View className="aspect-square h-[72px] w-[72px] items-center justify-center rounded-full bg-primary">
            <TouchableOpacity
              disabled={!isReady}
              onPress={onTakePhoto}
              className="aspect-square h-[64px] w-[64px] items-center justify-center rounded-full border-2 border-secondary bg-primary"
            >
              {!isReady && <ActivityIndicator size="small" />}
            </TouchableOpacity>
          </View>
          {!photoGuidelinesDisabled ? (
            <Button
              variant="ghost"
              size="icon"
              onPress={() => setShowGuidelinesModal(true)}
            >
              <Info
                size={CONFIG.icon.size.lg}
                className="text-primary"
                strokeWidth={1.5}
              />
            </Button>
          ) : (
            <View className="w-[40px]" />
          )}
        </View>
      </View>
      <PhotoGuidelinesModal
        visible={showGuidelinesModal}
        onClose={() => setShowGuidelinesModal(false)}
      />
    </CameraViewContainer>
  );
};
