export const SORT_ORDERS = [
  'name-asc',
  'name-desc',
  'date-newest',
  'date-oldest',
] as const;
export type SortOrder = (typeof SORT_ORDERS)[number];
