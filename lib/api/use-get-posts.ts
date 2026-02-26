import { useInfiniteQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { fetchApi } from './fetch-api';
import { PAGINATION_SCHEMA, POST_SCHEMA } from './types';

export { type Comment, type Post, type Vote } from './types';

const GET_POSTS_RESPONSE_SCHEMA = z.object({
  posts: z.array(POST_SCHEMA),
  pagination: PAGINATION_SCHEMA,
});

type GetPostsResponse = z.infer<typeof GET_POSTS_RESPONSE_SCHEMA>;

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam }): Promise<GetPostsResponse> => {
      const { success, data, publicFacingMessage } = await fetchApi({
        path: `/posts?page=${pageParam}`,
        method: 'GET',
        schema: GET_POSTS_RESPONSE_SCHEMA,
      });

      if (!success || !data) {
        throw new Error(publicFacingMessage ?? 'Failed to fetch posts');
      }

      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });
};
