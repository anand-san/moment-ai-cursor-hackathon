import { z } from 'zod';

// Available tags for tips
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

export type TipTag = (typeof tipTags)[number];

export const tipTagSchema = z.enum(tipTags);

// Tip categories
export const tipCategories = ['immediate', 'habit', 'mindset'] as const;
export type TipCategory = (typeof tipCategories)[number];
export const tipCategorySchema = z.enum(tipCategories);

// Swipe direction
export const swipeDirections = ['left', 'right'] as const;
export type SwipeDirection = (typeof swipeDirections)[number];
export const swipeDirectionSchema = z.enum(swipeDirections);

// Tip schema
export const tipSchema = z.object({
  id: z.string(),
  content: z.string(),
  tag: tipTagSchema,
  category: tipCategorySchema,
  priority: z.number(),
  swipeDirection: swipeDirectionSchema.nullable(),
});

export type Tip = z.infer<typeof tipSchema>;

// Analysis result from AI
export const analysisSchema = z.object({
  empathy: z.string(),
  tips: z.array(tipSchema),
});

export type Analysis = z.infer<typeof analysisSchema>;

// Previous tips batch (for regeneration history)
export const previousTipsBatchSchema = z.object({
  generatedAt: z.string(), // ISO date string
  tips: z.array(tipSchema),
});

export type PreviousTipsBatch = z.infer<typeof previousTipsBatchSchema>;

// Session schema (for Firestore)
export const sessionSchema = z.object({
  text: z.string(),
  createdAt: z.string(), // ISO date string
  analysis: analysisSchema.nullable(),
  previousTips: z.array(previousTipsBatchSchema),
});

export type Session = z.infer<typeof sessionSchema>;

// Session with ID (for API responses)
export const sessionWithIdSchema = sessionSchema.extend({
  id: z.string(),
});

export type SessionWithId = z.infer<typeof sessionWithIdSchema>;

// Tag counts for preferences
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

export type TagCounts = z.infer<typeof tagCountsSchema>;

// User preferences (for Firestore)
export const preferencesSchema = z.object({
  tagCounts: tagCountsSchema,
  updatedAt: z.string(), // ISO date string
});

export type Preferences = z.infer<typeof preferencesSchema>;

// Default tag counts for new users
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

// ============ API Request/Response Schemas ============

// Create session request
export const createSessionRequestSchema = z.object({
  text: z.string().min(1, 'Text is required'),
});

export type CreateSessionRequest = z.infer<typeof createSessionRequestSchema>;

// Create session response
export const createSessionResponseSchema = z.object({
  id: z.string(),
  text: z.string(),
  createdAt: z.string(),
});

export type CreateSessionResponse = z.infer<typeof createSessionResponseSchema>;

// Analyze session response
export const analyzeSessionResponseSchema = analysisSchema;
export type AnalyzeSessionResponse = z.infer<typeof analyzeSessionResponseSchema>;

// Swipe request
export const swipeRequestSchema = z.object({
  direction: swipeDirectionSchema,
});

export type SwipeRequest = z.infer<typeof swipeRequestSchema>;

// Swipe response
export const swipeResponseSchema = z.object({
  success: z.boolean(),
  tagCount: z.number().optional(),
});

export type SwipeResponse = z.infer<typeof swipeResponseSchema>;

// Get session response
export const getSessionResponseSchema = sessionWithIdSchema;
export type GetSessionResponse = z.infer<typeof getSessionResponseSchema>;

// Get preferences response
export const getPreferencesResponseSchema = z.object({
  tagCounts: tagCountsSchema,
});

export type GetPreferencesResponse = z.infer<typeof getPreferencesResponseSchema>;

// Valuable tip (includes session context)
export const valuableTipSchema = z.object({
  id: z.string(),
  content: z.string(),
  tag: tipTagSchema,
  sessionId: z.string(),
  sessionText: z.string(),
});

export type ValuableTip = z.infer<typeof valuableTipSchema>;

// Get valuable tips response
export const getValuableTipsResponseSchema = z.object({
  tips: z.array(valuableTipSchema),
});

export type GetValuableTipsResponse = z.infer<typeof getValuableTipsResponseSchema>;

// Route parameter schemas
export const sessionIdParamSchema = z.object({
  sessionId: z.string().min(1),
});

export const tipIdParamSchema = z.object({
  sessionId: z.string().min(1),
  tipId: z.string().min(1),
});
