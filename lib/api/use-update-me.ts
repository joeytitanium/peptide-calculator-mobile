import { MutationOptions, useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { fetchApi } from './fetch-api';

const UPDATE_ME_RESPONSE_SCHEMA = z.object({
  username: z.string().nullable(),
  profileImageUrl: z.string().nullable(),
  createdAt: z.string(),
});

type UpdateMeResponse = z.infer<typeof UPDATE_ME_RESPONSE_SCHEMA>;

type UpdateMeInput = {
  username?: string;
  profileImageBlob?: string; // base64 data URL (e.g., "data:image/jpeg;base64,...")
};

export const useUpdateMe = (
  options?: Omit<
    MutationOptions<UpdateMeResponse, Error, UpdateMeInput>,
    'mutationFn'
  >
) => {
  return useMutation({
    mutationFn: async (input: UpdateMeInput) => {
      const { success, data, publicFacingMessage } = await fetchApi({
        method: 'PATCH',
        path: '/me',
        body: input,
        schema: UPDATE_ME_RESPONSE_SCHEMA,
      });

      if (!success) {
        throw new Error(publicFacingMessage ?? 'Failed to update profile');
      }

      if (!data) {
        throw new Error('Failed to update profile');
      }

      return data;
    },
    ...options,
  });
};
