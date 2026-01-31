import { generateText, Output } from 'ai';
import { z } from 'zod';
import { openai } from './client';
import type { Analysis, TagCounts, Tip } from '@sandilya-stack/shared/types';
import { tipTagSchema, tipCategorySchema } from '@sandilya-stack/shared/types';

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

Order your tips so preferred tags appear first (higher priority numbers = show later).`;

// Schema for AI response (without swipeDirection as it's added later)
const aiResponseSchema = z.object({
  empathy: z.string(),
  tips: z.array(
    z.object({
      id: z.string(),
      content: z.string(),
      tag: tipTagSchema,
      category: tipCategorySchema,
      priority: z.number(),
    }),
  ),
});

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
  const { output } = await generateText({
    model: openai('gpt-4o'),
    output: Output.object({ schema: aiResponseSchema }),
    system: buildSystemPrompt(tagCounts),
    prompt: text,
    temperature: 0.7,
  });

  if (!output) {
    throw new Error('No structured output from AI');
  }

  // Add swipeDirection: null to each tip
  const tipsWithSwipe: Tip[] = output.tips.map(tip => ({
    ...tip,
    swipeDirection: null,
  }));

  return {
    empathy: output.empathy,
    tips: tipsWithSwipe,
  };
}
