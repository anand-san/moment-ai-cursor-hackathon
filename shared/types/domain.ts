import { z } from 'zod';

// ============ Constants ============

export const tipTags = [
  'break',
  'movement',
  'breathe',
  'simplify',
  'environment',
  'social',
  'timer',
  'reward',
  'acceptance',
] as const;

export const tipCategories = ['immediate', 'habit', 'mindset'] as const;

export const swipeDirections = ['left', 'right'] as const;

// ============ Base Types ============

export type TipTag = (typeof tipTags)[number];
export type TipCategory = (typeof tipCategories)[number];
export type SwipeDirection = (typeof swipeDirections)[number];

// ============ Schemas (for server validation) ============

export const tipTagSchema = z.enum(tipTags);
export const tipCategorySchema = z.enum(tipCategories);
export const swipeDirectionSchema = z.enum(swipeDirections);

export const tagCountsSchema = z.object({
  break: z.number(),
  movement: z.number(),
  breathe: z.number(),
  simplify: z.number(),
  environment: z.number(),
  social: z.number(),
  timer: z.number(),
  reward: z.number(),
  acceptance: z.number(),
});

// ============ Domain Types ============

export type Tip = {
  id: string;
  content: string;
  tag: TipTag;
  category: TipCategory;
  priority: number;
  swipeDirection: SwipeDirection | null;
};

export type Analysis = {
  empathy: string;
  tips: Tip[];
};

export type PreviousTipsBatch = {
  generatedAt: string;
  tips: Tip[];
};

export type Session = {
  text: string;
  createdAt: string;
  analysis: Analysis | null;
  previousTips: PreviousTipsBatch[];
};

export type SessionWithId = Session & {
  id: string;
};

export type TagCounts = {
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

export type Preferences = {
  tagCounts: TagCounts;
  updatedAt: string;
};

export type ValuableTip = {
  id: string;
  content: string;
  tag: TipTag;
  sessionId: string;
  sessionText: string;
};

export type SessionSummary = {
  id: string;
  text: string;
  createdAt: string;
  hasAnalysis: boolean;
  helpfulTipsCount: number;
};

// ============ Default Values ============

export const defaultTagCounts: TagCounts = {
  break: 0,
  movement: 0,
  breathe: 0,
  simplify: 0,
  environment: 0,
  social: 0,
  timer: 0,
  reward: 0,
  acceptance: 0,
};
