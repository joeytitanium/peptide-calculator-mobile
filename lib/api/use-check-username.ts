import { isValidUsername } from '@/lib/username';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { fetchApi } from './fetch-api';

const CHECK_USERNAME_RESPONSE_SCHEMA = z.object({
  username: z.string(),
  isAvailable: z.boolean(),
});

export const useCheckUsername = (username: string) => {
  return useQuery({
    queryKey: ['check-username', username],
    queryFn: async () => {
      const { success, data, publicFacingMessage } = await fetchApi({
        method: 'POST',
        path: '/users/check-username',
        body: { username },
        schema: CHECK_USERNAME_RESPONSE_SCHEMA,
      });

      if (!success || !data) {
        throw new Error(publicFacingMessage ?? 'Failed to check username');
      }

      return data;
    },
    enabled: isValidUsername(username),
    staleTime: 5000,
  });
};
