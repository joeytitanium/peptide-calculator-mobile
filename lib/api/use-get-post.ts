import { useQuery } from '@tanstack/react-query';
import { fetchApi } from './fetch-api';
import { POST_SCHEMA } from './types';

export { type Comment, type Post, type Vote } from './types';

export const useGetPost = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const { success, data, publicFacingMessage } = await fetchApi({
        path: `/posts/${postId}`,
        method: 'GET',
        schema: POST_SCHEMA,
      });

      if (!success || !data) {
        throw new Error(publicFacingMessage ?? 'Failed to fetch post');
      }

      return data;
    },
    enabled: !!postId,
  });
};
