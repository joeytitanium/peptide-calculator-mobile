import { File } from 'expo-file-system/next';

/**
 * Convert a local file URI to a base64 data URL
 * @param uri Local file URI (e.g., file://...)
 * @returns Base64 data URL (e.g., data:image/jpeg;base64,...)
 */
export const fileToBase64DataUrl = async (uri: string): Promise<string> => {
  const file = new File(uri);
  const base64 = await file.base64();

  // Determine mime type from extension
  const extension = uri.split('.').pop()?.toLowerCase() ?? 'jpg';
  const mimeType =
    extension === 'png'
      ? 'image/png'
      : extension === 'gif'
        ? 'image/gif'
        : 'image/jpeg';

  return `data:${mimeType};base64,${base64}`;
};

/**
 * Convert a Blob to a base64 data URL
 * @param blob Blob object
 * @returns Base64 data URL (e.g., data:image/jpeg;base64,...)
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Convert a file URI to a base64 data URL using fetch
 * @param uri File URI
 * @returns Base64 data URL (e.g., data:image/jpeg;base64,...)
 */
export const fileUriToBase64 = async (uri: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blobToBase64(blob);
};
