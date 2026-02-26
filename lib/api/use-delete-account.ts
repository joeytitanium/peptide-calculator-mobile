import { MutationOptions, useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { fetchApi } from './fetch-api';

const DELETE_ACCOUNT_RESPONSE_SCHEMA = z.object({
  requested: z.boolean(),
});

type DeleteAccountResponse = z.infer<typeof DELETE_ACCOUNT_RESPONSE_SCHEMA>;

export const useDeleteAccount = (
  options?: Omit<
    MutationOptions<DeleteAccountResponse, Error, void>,
    'mutationFn'
  >
) => {
  return useMutation({
    mutationFn: async () => {
      const { success, data, publicFacingMessage } = await fetchApi({
        method: 'POST',
        path: '/me/delete-request',
        schema: DELETE_ACCOUNT_RESPONSE_SCHEMA,
      });

      if (!success) {
        throw new Error(
          publicFacingMessage ?? 'Failed to request account deletion'
        );
      }

      if (!data) {
        throw new Error('Failed to request account deletion');
      }

      return data;
    },
    ...options,
  });
};
