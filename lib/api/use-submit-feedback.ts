import { MutationOptions, useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { fetchApi } from './fetch-api';
import { fileUriToBase64 } from '@/utils/file-to-base64';

const SUBMIT_FEEDBACK_RESPONSE_SCHEMA = z.object({
  id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  feedback: z.string(),
  createdAt: z.string(),
});

type SubmitFeedbackResponse = z.infer<typeof SUBMIT_FEEDBACK_RESPONSE_SCHEMA>;

type SubmitFeedbackInput = {
  rating: number;
  feedback: string;
  imageUri?: string;
};

export const useSubmitFeedback = (
  options?: Omit<
    MutationOptions<SubmitFeedbackResponse, Error, SubmitFeedbackInput>,
    'mutationFn'
  >
) => {
  return useMutation({
    mutationFn: async ({ rating, feedback, imageUri }: SubmitFeedbackInput) => {
      let imageBlob: string | undefined;

      if (imageUri) {
        imageBlob = await fileUriToBase64(imageUri);
      }

      const { success, data, publicFacingMessage } = await fetchApi({
        method: 'POST',
        path: '/feedback',
        body: {
          rating,
          feedback,
          imageBlob,
        },
        schema: SUBMIT_FEEDBACK_RESPONSE_SCHEMA,
      });

      if (publicFacingMessage) {
        throw new Error(publicFacingMessage);
      }

      if (!success) {
        throw new Error(publicFacingMessage ?? 'Failed to submit feedback');
      }

      if (!data) {
        throw new Error('Failed to submit feedback');
      }

      return data;
    },
    ...options,
  });
};
