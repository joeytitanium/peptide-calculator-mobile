import { MutationOptions, useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { fetchApi } from './fetch-api';

const REPORT_POST_RESPONSE_SCHEMA = z.object({
  id: z.uuid(),
});

type ReportPostResponse = z.infer<typeof REPORT_POST_RESPONSE_SCHEMA>;

type ReportPostInput = {
  postId: string;
  reason: string;
};

export const useReportPost = (
  options?: Omit<
    MutationOptions<ReportPostResponse, Error, ReportPostInput>,
    'mutationFn'
  >
) => {
  return useMutation({
    mutationFn: async ({ postId, reason }: ReportPostInput) => {
      const { success, data, publicFacingMessage } = await fetchApi({
        method: 'POST',
        path: `/posts/${postId}/report`,
        body: { reason },
        schema: REPORT_POST_RESPONSE_SCHEMA,
      });

      if (!success) {
        throw new Error(publicFacingMessage ?? 'Failed to report post');
      }

      if (!data) {
        throw new Error('Failed to report post');
      }

      return data;
    },
    ...options,
  });
};
