import { mock } from 'bun:test';

export interface MockAnalysisResponse {
  empathy: string;
  tips: Array<{
    id: string;
    content: string;
    tag: string;
    category: string;
    priority: number;
  }>;
}

let mockAnalysisResult: MockAnalysisResponse | Error = {
  empathy: 'I understand this is challenging.',
  tips: [
    {
      id: 'tip_1',
      content: 'Take a deep breath.',
      tag: 'breathe',
      category: 'immediate',
      priority: 1,
    },
    {
      id: 'tip_2',
      content: 'Break it into smaller tasks.',
      tag: 'simplify',
      category: 'immediate',
      priority: 2,
    },
  ],
};

export function setMockAnalysisResult(result: MockAnalysisResponse | Error) {
  mockAnalysisResult = result;
}

export function resetMockAnalysisResult() {
  mockAnalysisResult = {
    empathy: 'I understand this is challenging.',
    tips: [
      {
        id: 'tip_1',
        content: 'Take a deep breath.',
        tag: 'breathe',
        category: 'immediate',
        priority: 1,
      },
      {
        id: 'tip_2',
        content: 'Break it into smaller tasks.',
        tag: 'simplify',
        category: 'immediate',
        priority: 2,
      },
    ],
  };
}

// Mock OpenAI class
export const mockCreate = mock(async () => {
  if (mockAnalysisResult instanceof Error) {
    throw mockAnalysisResult;
  }
  return {
    choices: [
      {
        message: {
          content: JSON.stringify(mockAnalysisResult),
        },
      },
    ],
  };
});

export const MockOpenAI = mock(() => ({
  chat: {
    completions: {
      create: mockCreate,
    },
  },
}));

export function resetOpenAIMocks() {
  resetMockAnalysisResult();
  mockCreate.mockClear();
}
