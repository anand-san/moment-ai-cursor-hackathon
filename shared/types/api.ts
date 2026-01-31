import { z } from 'zod';
import {
  swipeDirectionSchema,
  type Analysis,
  type SessionWithId,
  type TagCounts,
  type ValuableTip,
  type SessionSummary,
} from './domain';

// ============ Request Schemas (server validation) ============

export const createSessionRequestSchema = z.object({
  text: z.string().min(1, 'Text is required'),
});

export const swipeRequestSchema = z.object({
  direction: swipeDirectionSchema,
});

export const sessionIdParamSchema = z.object({
  sessionId: z.string().min(1),
});

export const tipIdParamSchema = z.object({
  sessionId: z.string().min(1),
  tipId: z.string().min(1),
});

// ============ Response Types (frontend typing) ============

export type CreateSessionResponse = {
  id: string;
  text: string;
  createdAt: string;
};

export type AnalyzeSessionResponse = Analysis;

export type SwipeResponse = {
  success: boolean;
  tagCount?: number;
};

export type GetSessionResponse = SessionWithId;

export type GetPreferencesResponse = {
  tagCounts: TagCounts;
};

export type GetValuableTipsResponse = {
  tips: ValuableTip[];
};

export type GetAllSessionsResponse = {
  sessions: SessionSummary[];
};
