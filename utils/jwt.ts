import { z } from 'zod';

const JWT_PAYLOAD_SCHEMA = z.object({
  userId: z.string(),
  exp: z.number(),
  iat: z.number(),
});

export type JWTPayload = z.infer<typeof JWT_PAYLOAD_SCHEMA>;

export const parseJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    const validationResult = JWT_PAYLOAD_SCHEMA.safeParse(payload);

    if (!validationResult.success) {
      return null;
    }

    return validationResult.data;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = parseJWT(token);
  if (!payload) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  if (__DEV__) {
    const secondsLeft = payload.exp - currentTime;
    const minutesLeft = Math.floor(secondsLeft / 60);
    console.log(
      `⏰ JWT debug: ${minutesLeft}min (${secondsLeft}s) left until expiration`
    );
  }
  return payload.exp <= currentTime;
};

export const getTokenExpirationDate = (token: string): Date | null => {
  const payload = parseJWT(token);
  if (!payload) {
    return null;
  }

  return new Date(payload.exp * 1000);
};

export const getUserIdFromToken = (token: string): string | null => {
  const payload = parseJWT(token);
  return payload?.userId ?? null;
};
