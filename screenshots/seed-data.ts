import type { HeadacheRecord } from '@/types/app-specific/headache-record';
import type { TFunction } from 'i18next';
import { setHours, setMinutes, subDays } from 'date-fns';

function makeRecord(
  daysAgo: number,
  hour: number,
  minute: number,
  overrides: Partial<HeadacheRecord> = {}
): HeadacheRecord {
  const date = setMinutes(setHours(subDays(new Date(), daysAgo), hour), minute);
  const event = date.toISOString();
  return {
    id: `seed-${daysAgo}-${hour}-${minute}`,
    event,
    severity: 5,
    createdAt: event,
    ...overrides,
  };
}

export function getSeedRecords({ t }: { t: TFunction }): HeadacheRecord[] {
  return [
    // Today (0) — severe day
    makeRecord(0, 8, 15, {
      severity: 7,
      headacheType: 'migraine',
      location: 'left-side',
      duration: 120,
      notes: t('seedData.notes.wokeUpWithIt'),
    }),
    makeRecord(0, 14, 30, {
      severity: 4,
      headacheType: 'tension',
      location: 'front',
      duration: 45,
      notes: t('seedData.notes.afterLongMeeting'),
    }),

    // 1 day ago — moderate
    makeRecord(1, 9, 30, {
      severity: 5,
      headacheType: 'tension',
      location: 'front',
      duration: 60,
    }),
    makeRecord(1, 17, 30, { severity: 3, headacheType: 'tension', duration: 30 }),

    // 2 days ago — mild
    makeRecord(2, 10, 15, {
      severity: 2,
      headacheType: 'sinus',
      location: 'front',
      duration: 30,
    }),

    // 3 days ago — severe
    makeRecord(3, 11, 0, {
      severity: 8,
      headacheType: 'migraine',
      location: 'left-side',
      duration: 240,
      triggers: ['stress', 'lack-of-sleep'],
      notes: t('seedData.notes.leftWorkEarly'),
    }),

    // 4 days ago — moderate
    makeRecord(4, 7, 30, {
      severity: 6,
      headacheType: 'tension',
      location: 'all-over',
      duration: 90,
    }),
    makeRecord(4, 15, 30, {
      severity: 4,
      headacheType: 'tension',
      location: 'back',
      duration: 45,
    }),

    // 5 days ago — mild
    makeRecord(5, 16, 0, {
      severity: 3,
      headacheType: 'sinus',
      location: 'front',
      duration: 30,
    }),

    // 6 days ago — severe
    makeRecord(6, 8, 30, {
      severity: 9,
      headacheType: 'migraine',
      location: 'right-side',
      duration: 180,
      medications: ['triptan'],
      notes: t('seedData.notes.worstThisMonth'),
    }),

    // 7 days ago — moderate
    makeRecord(7, 10, 0, {
      severity: 5,
      headacheType: 'tension',
      location: 'front',
      duration: 60,
    }),

    // 8 days ago — no headache (empty)

    // 9 days ago — mild
    makeRecord(9, 13, 0, { severity: 2, headacheType: 'tension', duration: 30 }),

    // 10 days ago — severe
    makeRecord(10, 10, 0, {
      severity: 8,
      headacheType: 'cluster',
      location: 'left-side',
      duration: 60,
      triggers: ['alcohol'],
    }),

    // 11 days ago — moderate
    makeRecord(11, 8, 15, {
      severity: 6,
      headacheType: 'migraine',
      location: 'front',
      duration: 120,
    }),

    // 12 days ago — mild
    makeRecord(12, 15, 30, {
      severity: 3,
      headacheType: 'tension',
      location: 'back',
      duration: 45,
    }),

    // 13 days ago — severe
    makeRecord(13, 7, 30, {
      severity: 7,
      headacheType: 'migraine',
      location: 'all-over',
      duration: 180,
      triggers: ['stress', 'weather'],
      medications: ['ibuprofen'],
      notes: t('seedData.notes.rainyDay'),
    }),

    // 14 days ago — moderate
    makeRecord(14, 14, 0, {
      severity: 5,
      headacheType: 'tension',
      location: 'front',
      duration: 60,
    }),

    // 15 days ago — mild
    makeRecord(15, 11, 0, {
      severity: 2,
      headacheType: 'sinus',
      location: 'front',
      duration: 30,
    }),

    // 16 days ago — moderate
    makeRecord(16, 10, 30, {
      severity: 4,
      headacheType: 'tension',
      location: 'back',
      duration: 45,
    }),

    // 17 days ago — severe
    makeRecord(17, 8, 0, {
      severity: 9,
      headacheType: 'migraine',
      location: 'left-side',
      duration: 300,
      triggers: ['hormones', 'lack-of-sleep'],
      medications: ['triptan', 'ibuprofen'],
      notes: t('seedData.notes.onlySleptFourHours'),
    }),

    // 18 days ago — mild
    makeRecord(18, 16, 0, { severity: 3, headacheType: 'tension', duration: 30 }),

    // 19 days ago — moderate
    makeRecord(19, 11, 30, {
      severity: 5,
      headacheType: 'tension',
      location: 'front',
      duration: 60,
    }),

    // 20 days ago — no headache (empty)

    // 21 days ago — severe
    makeRecord(21, 10, 0, {
      severity: 7,
      headacheType: 'cluster',
      location: 'right-side',
      duration: 90,
    }),

    // 22 days ago — mild
    makeRecord(22, 15, 30, {
      severity: 2,
      headacheType: 'tension',
      duration: 30,
    }),

    // 23 days ago — moderate
    makeRecord(23, 11, 0, {
      severity: 6,
      headacheType: 'migraine',
      location: 'front',
      duration: 120,
      medications: ['acetaminophen'],
    }),

    // 24 days ago — mild
    makeRecord(24, 14, 0, {
      severity: 3,
      headacheType: 'sinus',
      location: 'front',
      duration: 45,
    }),

    // 25 days ago — severe
    makeRecord(25, 9, 30, {
      severity: 8,
      headacheType: 'migraine',
      location: 'all-over',
      duration: 240,
      triggers: ['stress', 'caffeine'],
      notes: t('seedData.notes.tooMuchCoffee'),
    }),

    // 26 days ago — moderate
    makeRecord(26, 12, 30, {
      severity: 5,
      headacheType: 'tension',
      location: 'back',
      duration: 60,
    }),

    // 27 days ago — mild
    makeRecord(27, 17, 0, { severity: 2, headacheType: 'tension', duration: 30 }),

    // 28 days ago — moderate
    makeRecord(28, 10, 0, {
      severity: 4,
      headacheType: 'tension',
      location: 'front',
      duration: 45,
    }),

    // 29 days ago — severe
    makeRecord(29, 8, 15, {
      severity: 7,
      headacheType: 'migraine',
      location: 'left-side',
      duration: 180,
      triggers: ['weather'],
      medications: ['triptan'],
    }),

    // 30 days ago — mild
    makeRecord(30, 15, 30, {
      severity: 3,
      headacheType: 'sinus',
      location: 'front',
      duration: 30,
    }),
  ];
}
