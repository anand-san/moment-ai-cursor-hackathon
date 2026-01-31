import { z } from 'zod';
import { Timestamp } from '../firebase';
import { tagCountsSchema } from '@sandilya-stack/shared/types';

// Internal preferences type with Firestore Timestamps
export const preferencesDocSchema = z.object({
  tagCounts: tagCountsSchema,
  updatedAt: z.instanceof(Timestamp),
});

export type PreferencesDoc = z.infer<typeof preferencesDocSchema>;

// For the converter
export type PreferencesDocRaw = {
  tagCounts: {
    break: number;
    movement: number;
    breathe: number;
    simplify: number;
    environment: number;
    social: number;
    timer: number;
    reward: number;
    acceptance: number;
  };
  updatedAt: Timestamp;
};
