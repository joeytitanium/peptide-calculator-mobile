import type { HeadacheType } from '@/utils/async-storage';

export const HEADACHE_SEVERITIES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export type HeadacheSeverity = (typeof HEADACHE_SEVERITIES)[number];

export const HEADACHE_LOCATIONS = [
  'front',
  'back',
  'left-side',
  'right-side',
  'top',
  'all-over',
] as const;
export type HeadacheLocation = (typeof HEADACHE_LOCATIONS)[number];

export const HEADACHE_TRIGGERS = [
  'stress',
  'lack-of-sleep',
  'dehydration',
  'screen-time',
  'weather',
  'food',
  'alcohol',
  'caffeine',
  'hormones',
  'exercise',
] as const;
export type HeadacheTrigger = (typeof HEADACHE_TRIGGERS)[number];

export const HEADACHE_MEDICATIONS = [
  'ibuprofen',
  'acetaminophen',
  'aspirin',
  'triptan',
  'none',
] as const;
export type HeadacheMedication = (typeof HEADACHE_MEDICATIONS)[number];

export type HeadacheRecord = {
  id: string;
  event: string; // ISO datetime string
  severity: number; // 1-10
  headacheType?: HeadacheType;
  location?: HeadacheLocation;
  duration?: number; // minutes
  triggers?: HeadacheTrigger[];
  medications?: HeadacheMedication[];
  notes?: string;
  createdAt: string;
};
