import { MutationOptions, useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { fetchApi } from './fetch-api';

const REGISTER_DEVICE_TOKEN_RESPONSE_SCHEMA = z.object({
  id: z.string(),
});

type RegisterDeviceTokenResponse = z.infer<
  typeof REGISTER_DEVICE_TOKEN_RESPONSE_SCHEMA
>;

type RegisterDeviceTokenInput = {
  deviceToken: string;
};

export const useRegisterDeviceToken = (
  options?: Omit<
    MutationOptions<
      RegisterDeviceTokenResponse,
      Error,
      RegisterDeviceTokenInput
    >,
    'mutationFn'
  >
) => {
  return useMutation({
    mutationFn: async (input: RegisterDeviceTokenInput) => {
      const { success, data, publicFacingMessage } = await fetchApi({
        method: 'POST',
        path: '/device-tokens',
        body: input,
        schema: REGISTER_DEVICE_TOKEN_RESPONSE_SCHEMA,
      });

      if (!success) {
        throw new Error(
          publicFacingMessage ?? 'Failed to register device token'
        );
      }

      if (!data) {
        throw new Error('Failed to register device token');
      }

      return data;
    },
    ...options,
  });
};
