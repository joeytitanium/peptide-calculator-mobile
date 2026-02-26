export const RESULT_VARIANTS = [
  'success',
  'warning',
  'danger',
  'info',
] as const;
export type ResultVariant = (typeof RESULT_VARIANTS)[number];
