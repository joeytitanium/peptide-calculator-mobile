import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { fetchApi } from './fetch-api';
import { VOTE_VALUES, VoteValue } from './types';

const VOTE_RESPONSE_SCHEMA = z.object({
  id: z.uuid(),
  postId: z.uuid(),
  vote: z.enum(VOTE_VALUES),
});

const DELETE_VOTE_RESPONSE_SCHEMA = z.object({
  id: z.uuid(),
});

type VoteInput = {
  postId: string;
  vote: VoteValue;
};

type DeleteVoteInput = {
  postId: string;
};

export const useVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, vote }: VoteInput) => {
      const { success, data, publicFacingMessage } = await fetchApi({
        method: 'POST',
        path: `/posts/${postId}/vote`,
        body: { vote },
        schema: VOTE_RESPONSE_SCHEMA,
      });

      if (!success) {
        throw new Error(publicFacingMessage ?? 'Failed to vote');
      }

      if (!data) {
        throw new Error('Failed to vote');
      }

      return data;
    },
    onSuccess: (data) => {
      // Invalidate both the single post and posts list queries
      void queryClient.invalidateQueries({ queryKey: ['post', data.postId] });
      void queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useDeleteVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId }: DeleteVoteInput) => {
      const { success, data, publicFacingMessage } = await fetchApi({
        method: 'DELETE',
        path: `/posts/${postId}/vote`,
        schema: DELETE_VOTE_RESPONSE_SCHEMA,
      });

      if (!success) {
        throw new Error(publicFacingMessage ?? 'Failed to remove vote');
      }

      if (!data) {
        throw new Error('Failed to remove vote');
      }

      return { ...data, postId };
    },
    onSuccess: (data) => {
      // Invalidate both the single post and posts list queries
      void queryClient.invalidateQueries({ queryKey: ['post', data.postId] });
      void queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
