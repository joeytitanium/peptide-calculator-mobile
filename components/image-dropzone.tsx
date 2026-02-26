import { resizeImage } from '@/utils/resize-image';
import clsx from 'clsx';
import { Image } from 'expo-image';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { ImagePlus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { iconWithClassName } from './icons/iconWithClassName';

iconWithClassName(ImagePlus);

type ImageDropzoneProps = {
  onAddImage: (imageUri: string) => void;
  className?: string;
  /** Optional initial image URI to pre-fill the dropzone */
  initialImageUri?: string | null;
};

export const ImageDropzone = ({
  onAddImage,
  className,
  initialImageUri,
}: ImageDropzoneProps) => {
  const [inputImageUri, setInputImageUri] = useState<string | null>(
    initialImageUri ?? null
  );

  // Notify parent when initial image is set
  useEffect(() => {
    if (initialImageUri) {
      onAddImage(initialImageUri);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPress = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    const { uri } = result.assets[0];
    const resizedUri = await resizeImage({ url: uri });

    setInputImageUri(resizedUri);
    onAddImage(resizedUri);
  };

  return (
    <Pressable
      onPress={onPress}
      className={clsx(
        'h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-2xl bg-secondary',
        className
      )}
    >
      {inputImageUri ? (
        <Image
          source={{ uri: inputImageUri }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
      ) : (
        <ImagePlus className="text-muted-foreground" />
      )}
    </Pressable>
  );
};
