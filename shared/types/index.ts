// Domain types and schemas
export {
  // Constants
  tipTags,
  tipCategories,
  swipeDirections,
  defaultTagCounts,
  // Base types
  type TipTag,
  type TipCategory,
  type SwipeDirection,
  // Schemas (server validation)
  tipTagSchema,
  tipCategorySchema,
  swipeDirectionSchema,
  tagCountsSchema,
  // Domain types
  type Tip,
  type Analysis,
  type PreviousTipsBatch,
  type Session,
  type SessionWithId,
  type TagCounts,
  type Preferences,
  type ValuableTip,
  type SessionSummary,
} from './domain';

// API types and schemas
export {
  // Request schemas (server validation)
  createSessionRequestSchema,
  swipeRequestSchema,
  sessionIdParamSchema,
  tipIdParamSchema,
  // Response types (frontend typing)
  type CreateSessionResponse,
  type AnalyzeSessionResponse,
  type SwipeResponse,
  type GetSessionResponse,
  type GetPreferencesResponse,
  type GetValuableTipsResponse,
  type GetAllSessionsResponse,
} from './api';
