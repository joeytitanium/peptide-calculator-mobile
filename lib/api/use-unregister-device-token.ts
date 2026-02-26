import { MutationOptions, useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { fetchApi } from './fetch-api';

const UNREGISTER_DEVICE_TOKEN_RESPONSE_SCHEMA = z.object({
  id: z.string(),
});

type UnregisterDeviceTokenResponse = z.infer<
  typeof UNREGISTER_DEVICE_TOKEN_RESPONSE_SCHEMA
>;

type UnregisterDeviceTokenInput = {
  deviceToken: string;
};

export const useUnregisterDeviceToken = (
  options?: Omit<
    MutationOptions<
      UnregisterDeviceTokenResponse,
      Error,
      UnregisterDeviceTokenInput
    >,
    'mutationFn'
  >
) => {
  return useMutation({
    mutationFn: async (input: UnregisterDeviceTokenInput) => {
      const { success, data, publicFacingMessage } = await fetchApi({
        method: 'DELETE',
        path: '/device-tokens',
        body: input,
        schema: UNREGISTER_DEVICE_TOKEN_RESPONSE_SCHEMA,
      });

      if (!success) {
        throw new Error(
          publicFacingMessage ?? 'Failed to unregister device token'
        );
      }

      if (!data) {
        throw new Error('Failed to unregister device token');
      }

      return data;
    },
    ...options,
  });
};
