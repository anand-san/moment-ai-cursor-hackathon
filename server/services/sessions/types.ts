import { Timestamp } from '../firebase';
import type {
  TipTag,
  TipCategory,
  SwipeDirection,
} from '@sandilya-stack/shared/types';

// Tip type for internal storage
export type TipDoc = {
  id: string;
  content: string;
  tag: TipTag;
  category: TipCategory;
  priority: number;
  swipeDirection: SwipeDirection | null;
};

// For the converter - the raw document type
export type SessionDocRaw = {
  text: string;
  createdAt: Timestamp;
  analysis: {
    empathy: string;
    tips: TipDoc[];
  } | null;
  previousTips: Array<{
    generatedAt: Timestamp;
    tips: TipDoc[];
  }>;
};
