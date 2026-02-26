import { CONFIG } from '@/config';
import { getAsyncStorageItem } from '@/utils/async-storage';
import i18n from '@/lib/i18n';
import Purchases from 'react-native-purchases';
import { z } from 'zod';
import {
  ErrorResponse,
  parseApiResponse,
  SuccessResponse,
} from './parse-api-response';

type BaseOptions<T> = {
  path: string;
  schema: z.ZodType<T>;
};

type GetOptions<T> = BaseOptions<T> & {
  method?: 'GET';
  body?: never;
};

type DeleteOptions<T> = BaseOptions<T> & {
  method: 'DELETE';
  body?: object;
};

type MutationOptions<T> = BaseOptions<T> & {
  method: 'POST' | 'PATCH' | 'PUT';
  body?: object;
};

type FetchApiOptions<T> = GetOptions<T> | DeleteOptions<T> | MutationOptions<T>;

export const fetchApi = async <T>(
  options: FetchApiOptions<T>
): Promise<(SuccessResponse<T> | ErrorResponse) & { status: number }> => {
  const { path, schema, method = 'GET' } = options;
  const body = 'body' in options ? options.body : undefined;

  const [userId, authState] = await Promise.all([
    Purchases.getAppUserID(),
    getAsyncStorageItem('auth-state'),
  ]);

  const appleIdentityToken = authState.data?.identityToken;

  const response = await fetch(`${CONFIG.apiUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
      'Accept-Language': i18n.language,
      ...(appleIdentityToken && {
        'x-apple-identity-token': appleIdentityToken,
      }),
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  const parsedResponse = await parseApiResponse({
    response,
    dataSchema: schema,
  });

  return {
    ...parsedResponse,
    status: response.status,
  };
};
