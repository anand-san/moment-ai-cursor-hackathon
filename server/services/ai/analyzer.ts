import { getOpenAIClient } from './client';
import type { Analysis, TagCounts, Tip } from '@sandilya-stack/shared/types';
import { analysisSchema } from '@sandilya-stack/shared/types';

const SYSTEM_PROMPT = `You are an empathetic ADHD coach. When given a user's brain dump (stream of consciousness about their current struggle), you will:

1. Provide a SHORT (1-2 sentences) empathetic response acknowledging their feelings
2. Generate 3-5 practical tips with assigned tags

Available tags and their meanings:
- break: Suggestions to pause or take a break
- movement: Physical activity or body movement
- breathe: Breathing exercises or calming techniques
- simplify: Breaking tasks into smaller steps
- environment: Changing physical surroundings
- social: Connecting with others for support
- timer: Time-boxing or deadline techniques
- reward: Self-reward systems
- acceptance: Self-compassion and acceptance

Categories:
- immediate: Do right now (under 5 min)
- habit: Build into routine
- mindset: Perspective shift

The user has these tag preferences (higher = more helpful to them):
{tagCounts}

Order your tips so preferred tags appear first (higher priority numbers = show later).

Respond ONLY with valid JSON:
{
  "empathy": "string",
  "tips": [
    {
      "id": "tip_<number>",
      "content": "string",
      "tag": "one of the available tags",
      "category": "immediate|habit|mindset",
      "priority": number (1 = show first)
    }
  ]
}`;

function buildSystemPrompt(tagCounts: TagCounts): string {
  const tagCountsStr = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([tag, count]) => `  ${tag}: ${count}`)
    .join('\n');

  return SYSTEM_PROMPT.replace('{tagCounts}', tagCountsStr);
}

export async function analyzeText(
  text: string,
  tagCounts: TagCounts,
): Promise<Analysis> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: buildSystemPrompt(tagCounts) },
      { role: 'user', content: text },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 1000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  const parsed = JSON.parse(content);

  // Add swipeDirection: null to each tip
  const tipsWithSwipe: Tip[] = parsed.tips.map(
    (tip: Omit<Tip, 'swipeDirection'>) => ({
      ...tip,
      swipeDirection: null,
    }),
  );

  const result = {
    empathy: parsed.empathy,
    tips: tipsWithSwipe,
  };

  // Validate with Zod
  return analysisSchema.parse(result);
}
