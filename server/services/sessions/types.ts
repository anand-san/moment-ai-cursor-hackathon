import { Timestamp } from '../firebase';
import type {
  TipTag,
  TipCategory,
  SwipeDirection,
  ActionType,
} from '@sandilya-stack/shared/types';

// Tip type for internal storage
export type TipDoc = {
  id: string;
  title: string;
  description: string;
  tag: TipTag;
  category: TipCategory;
  priority: number;
  timeEstimate: string;
  actionType: ActionType;
  swipeDirection: SwipeDirection | null;
};

// For the converter - the raw document type
export type SessionDocRaw = {
  text: string;
  createdAt: Timestamp;
  analysis: {
    empathy: string;
    identifiedProblems: string[];
    tips: TipDoc[];
  } | null;
  previousTips: Array<{
    generatedAt: Timestamp;
    tips: TipDoc[];
  }>;
};
