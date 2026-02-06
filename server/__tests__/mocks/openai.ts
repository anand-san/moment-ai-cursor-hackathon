import { mock } from 'bun:test';

export interface MockAnalysisResponse {
  empathy: string;
  identified_problems: string[];
  tips: Array<{
    id: string;
    title: string;
    description: string;
    tag: string;
    category: string;
    priority: number;
    time_estimate: string;
    action_type: 'none' | 'timer' | 'reminder' | 'message' | 'save';
  }>;
}

const defaultAnalysisResult: MockAnalysisResponse = {
  empathy: 'I understand this is challenging.',
  identified_problems: ['Feeling overwhelmed', 'Task paralysis'],
  tips: [
    {
      id: 'tip_1',
      title: 'Take a deep breath',
      description:
        'Pause for 30 seconds and focus on slow, deep breaths to calm your nervous system.',
      tag: 'breathe',
      category: 'immediate',
      priority: 1,
      time_estimate: '30 sec',
      action_type: 'timer',
    },
    {
      id: 'tip_2',
      title: 'Break it into smaller tasks',
      description:
        'Write down just the next ONE thing you need to do, not the whole list.',
      tag: 'simplify',
      category: 'immediate',
      priority: 2,
      time_estimate: '2 min',
      action_type: 'none',
    },
  ],
};

let mockAnalysisResult: MockAnalysisResponse | Error = {
  ...defaultAnalysisResult,
};

export function setMockAnalysisResult(result: MockAnalysisResponse | Error) {
  mockAnalysisResult = result;
}

export function resetMockAnalysisResult() {
  mockAnalysisResult = { ...defaultAnalysisResult };
}

// Mock generateText from Vercel AI SDK
export const mockGenerateText = mock(async () => {
  if (mockAnalysisResult instanceof Error) {
    throw mockAnalysisResult;
  }
  return {
    output: mockAnalysisResult,
    text: '',
    finishReason: 'stop',
    usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
  };
});

// Mock Output from Vercel AI SDK
export const MockOutput = {
  object: (_opts: unknown) => ({}),
};

// Mock Google Gemini provider
export const mockGemini = mock((_modelId: string) => ({
  modelId: _modelId,
  provider: 'google',
}));

export function resetOpenAIMocks() {
  resetMockAnalysisResult();
  mockGenerateText.mockClear();
}
