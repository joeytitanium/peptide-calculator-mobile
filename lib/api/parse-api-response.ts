import { logDebugMessage } from '@/utils/logger';
import { z } from 'zod';

export const INTERNAL_ERROR_CODE_SCHEMA = z.enum(['subscription-expired']);
export type InternalErrorCode = z.infer<typeof INTERNAL_ERROR_CODE_SCHEMA>;

const API_SUCCESS_PAYLOAD_SCHEMA = <T>(schema: z.ZodType<T>) =>
  z
    .object({
      success: z.literal(true),
      data: schema.nullish(),
      publicFacingMessage: z.undefined().optional(),
      internalErrorCode: z.undefined().optional(),
    })
    .strip();

export type SuccessResponse<T> = z.infer<
  ReturnType<typeof API_SUCCESS_PAYLOAD_SCHEMA<T>>
>;

const API_ERROR_PAYLOAD_SCHEMA = z
  .object({
    success: z.literal(false),
    data: z.undefined().optional(),
    publicFacingMessage: z.string().nullish(),
    internalErrorCode: INTERNAL_ERROR_CODE_SCHEMA.nullish(),
  })
  .strip();
export type ErrorResponse = z.infer<typeof API_ERROR_PAYLOAD_SCHEMA>;

export const parseApiResponse = async <T>({
  response,
  dataSchema,
}: {
  response: Response;
  dataSchema: z.ZodType<T>;
}): Promise<SuccessResponse<T> | ErrorResponse> => {
  const responseBody = await response.json();

  const responseSchema = z.discriminatedUnion('success', [
    API_SUCCESS_PAYLOAD_SCHEMA(dataSchema),
    API_ERROR_PAYLOAD_SCHEMA,
  ]);

  const parsedResponse = responseSchema.safeParse(responseBody);
  if (!parsedResponse.success) {
    logDebugMessage({
      message: 'Error parsing response',
      context: { responseBody, parsedResponse },
    });

    return {
      success: false,
      data: undefined,
      publicFacingMessage: 'Error parsing response',
      internalErrorCode: undefined,
    } as ErrorResponse;
  }

  if (!parsedResponse.data.success) {
    logDebugMessage({
      message: 'Server returned a false success value',
      context: { responseBody, parsedResponse },
    });
    const errorResponse = parsedResponse.data as ErrorResponse;
    return errorResponse;
  }

  return parsedResponse.data as SuccessResponse<T>;
};
