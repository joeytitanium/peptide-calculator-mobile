import {
  MutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { z } from 'zod';
import { fetchApi } from './fetch-api';
import { fileUriToBase64 } from '@/utils/file-to-base64';

const POST_SCHEMA = z.object({
  id: z.uuid(),
  content: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: z.string(),
});

type Post = z.infer<typeof POST_SCHEMA>;

type CreatePostInput = {
  content: string;
  imageUri?: string | null;
};

export const useCreatePost = (
  options?: Omit<MutationOptions<Post, Error, CreatePostInput>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, imageUri }: CreatePostInput) => {
      let imageBlob: string | undefined;

      if (imageUri) {
        imageBlob = await fileUriToBase64(imageUri);
      }

      const { success, data, publicFacingMessage } = await fetchApi({
        method: 'POST',
        path: '/posts',
        body: {
          content,
          imageBlob,
        },
        schema: POST_SCHEMA,
      });

      if (publicFacingMessage) {
        throw new Error(publicFacingMessage);
      }

      if (!success) {
        throw new Error(publicFacingMessage ?? 'Failed to create post');
      }

      if (!data) {
        throw new Error('Failed to create post');
      }

      return data;
    },
    ...options,
    onSuccess: (...args) => {
      // Invalidate the posts query to refresh the feed
      void queryClient.invalidateQueries({ queryKey: ['posts'] });
      // Call the original onSuccess if provided
      return options?.onSuccess?.(...args);
    },
  });
};
