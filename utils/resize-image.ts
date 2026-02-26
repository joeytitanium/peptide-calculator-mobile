import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { Image } from 'react-native';

const getImageSize = (
  uri: string
): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) => {
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject);
  });

export const resizeImage = async ({
  url,
  maxSize = 1024,
  quality = 80,
}: {
  url: string;
  maxSize?: number;
  quality?: number;
}) => {
  const { width, height } = await getImageSize(url);

  const context = ImageManipulator.manipulate(url);

  // Only resize if larger than maxSize, and preserve aspect ratio
  if (width > maxSize || height > maxSize) {
    if (width >= height) {
      context.resize({ width: maxSize });
    } else {
      context.resize({ height: maxSize });
    }
  }

  const image = await context.renderAsync();
  const result = await image.saveAsync({
    format: SaveFormat.JPEG,
    compress: quality / 100,
  });

  return result.uri;
};
