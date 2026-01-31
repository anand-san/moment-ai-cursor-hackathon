import { api } from './client';
import type {
  CreateSessionResponse,
  AnalyzeSessionResponse,
  GetSessionResponse,
  SwipeResponse,
  GetValuableTipsResponse,
  GetAllSessionsResponse,
} from '@sandilya-stack/shared/types';

export async function createSession(
  text: string,
): Promise<CreateSessionResponse> {
  const response = await api.sessions.$post({
    json: { text },
  });

  if (!response.ok) {
    throw new Error('Failed to create session');
  }

  return response.json();
}

export async function getSession(
  sessionId: string,
): Promise<GetSessionResponse> {
  const response = await api.sessions[':sessionId'].$get({
    param: { sessionId },
  });

  if (!response.ok) {
    throw new Error('Failed to get session');
  }

  return response.json() as Promise<GetSessionResponse>;
}

export async function analyzeSession(
  sessionId: string,
): Promise<AnalyzeSessionResponse> {
  const response = await api.sessions[':sessionId'].analyze.$post({
    param: { sessionId },
  });

  if (!response.ok) {
    throw new Error('Failed to analyze session');
  }

  return response.json() as Promise<AnalyzeSessionResponse>;
}

export async function swipeTip(
  sessionId: string,
  tipId: string,
  direction: 'left' | 'right',
): Promise<SwipeResponse> {
  const response = await api.sessions[':sessionId'].tips[':tipId'].swipe.$post({
    param: { sessionId, tipId },
    json: { direction },
  });

  if (!response.ok) {
    throw new Error('Failed to record swipe');
  }

  return response.json();
}

export async function regenerateTips(
  sessionId: string,
): Promise<AnalyzeSessionResponse> {
  const response = await api.sessions[':sessionId'].regenerate.$post({
    param: { sessionId },
  });

  if (!response.ok) {
    throw new Error('Failed to regenerate tips');
  }

  return response.json() as Promise<AnalyzeSessionResponse>;
}

export async function getValuableTips(): Promise<GetValuableTipsResponse> {
  const response = await api.tips.valuable.$get();

  if (!response.ok) {
    throw new Error('Failed to get valuable tips');
  }

  return response.json();
}

export async function getAllSessions(): Promise<GetAllSessionsResponse> {
  const response = await api.sessions.$get();

  if (!response.ok) {
    throw new Error('Failed to get sessions');
  }

  return response.json();
}
