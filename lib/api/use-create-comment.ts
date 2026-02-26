import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { fetchApi } from './fetch-api';

const CREATE_COMMENT_RESPONSE_SCHEMA = z.object({
  id: z.uuid(),
  postId: z.uuid(),
  content: z.string(),
  authorUsername: z.string(),
  createdAt: z.string(),
});

type CreateCommentInput = {
  postId: string;
  content: string;
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, content }: CreateCommentInput) => {
      const { success, data, publicFacingMessage } = await fetchApi({
        method: 'POST',
        path: `/posts/${postId}/comments`,
        body: { content },
        schema: CREATE_COMMENT_RESPONSE_SCHEMA,
      });

      if (!success) {
        throw new Error(publicFacingMessage ?? 'Failed to create comment');
      }

      if (!data) {
        throw new Error('Failed to create comment');
      }

      return data;
    },
    onSuccess: (data) => {
      // Invalidate the post query to refetch comments
      void queryClient.invalidateQueries({ queryKey: ['post', data.postId] });
      // Also invalidate the posts list in case comment count is shown
      void queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
