import {
  MutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { z } from 'zod';
import { fetchApi } from './fetch-api';

const DELETE_POST_RESPONSE_SCHEMA = z.object({
  id: z.uuid(),
});

type DeletePostResponse = z.infer<typeof DELETE_POST_RESPONSE_SCHEMA>;

export const useDeletePost = (
  options?: Omit<
    MutationOptions<DeletePostResponse, Error, string>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { success, data, publicFacingMessage } = await fetchApi({
        method: 'DELETE',
        path: `/posts/${postId}`,
        schema: DELETE_POST_RESPONSE_SCHEMA,
      });

      if (!success) {
        throw new Error(publicFacingMessage ?? 'Failed to delete post');
      }

      if (!data) {
        throw new Error('Failed to delete post');
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate posts query to refresh the feed
      void queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    ...options,
  });
};
