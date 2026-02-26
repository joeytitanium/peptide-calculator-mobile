import { CONFIG } from '@/config';
import type { WaterAnalysisResult } from '@/types/app-specific/water-record';
import { getAsyncStorageItem } from '@/utils/async-storage';
import { fileUriToBase64 } from '@/utils/file-to-base64';
import { resizeImage } from '@/utils/resize-image';
import { useCallback, useState } from 'react';
import Purchases from 'react-native-purchases';

type AnalyzePhotoResult =
  | { success: true; data: WaterAnalysisResult }
  | {
      success: false;
      reason: 'subscription_required' | 'no_container_detected' | 'error';
      message?: string;
    };

export const useAnalyzeWaterPhoto = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzePhoto = useCallback(
    async (uri: string): Promise<AnalyzePhotoResult> => {
      setIsAnalyzing(true);

      try {
        const resizedUri = await resizeImage({ url: uri });
        const imageDataUrl = await fileUriToBase64(resizedUri);

        const [userId, authState] = await Promise.all([
          Purchases.getAppUserID(),
          getAsyncStorageItem('auth-state'),
        ]);

        const response = await fetch(`${CONFIG.apiUrl}/analyze-water-container`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId,
            ...(authState.data?.identityToken && {
              'x-apple-identity-token': authState.data.identityToken,
            }),
          },
          body: JSON.stringify({ inputImageBlob: imageDataUrl }),
        });

        if (response.status === 402) {
          return { success: false, reason: 'subscription_required' };
        }

        if (!response.ok) {
          return { success: false, reason: 'error' };
        }

        const json = (await response.json()) as {
          data?: {
            error?: string | null;
            amount?: number;
            containerType?: string;
            confidence?: number;
          };
        };

        const data = json.data;
        if (!data) {
          return { success: false, reason: 'error' };
        }

        if (data.error) {
          return {
            success: false,
            reason: 'no_container_detected',
            message: data.error,
          };
        }

        const amount = data.amount;
        if (typeof amount !== 'number' || amount <= 0) {
          return { success: false, reason: 'error' };
        }

        return {
          success: true,
          data: {
            amount,
            containerType: data.containerType,
            confidence: data.confidence ?? 1,
          },
        };
      } catch {
        return { success: false, reason: 'error' };
      } finally {
        setIsAnalyzing(false);
      }
    },
    []
  );

  return { analyzePhoto, isAnalyzing };
};
