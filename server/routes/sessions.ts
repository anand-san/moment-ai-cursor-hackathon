import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import {
  createSession,
  getSession,
  getAllSessions,
  updateSessionAnalysis,
  updateTipSwipe,
  regenerateTips,
} from '../services/sessions';
import { getPreferences, incrementTag } from '../services/preferences';
import { analyzeText } from '../services/ai';
import {
  createSessionRequestSchema,
  sessionIdParamSchema,
  tipIdParamSchema,
  swipeRequestSchema,
} from '@sandilya-stack/shared/types';

export const sessionsRoute = new Hono()
  // Get all sessions
  .get('/', async c => {
    const userId = c.get('user').uid;

    const sessions = await getAllSessions({ userId });

    return c.json({ sessions });
  })

  // Create session (save brain dump)
  .post('/', zValidator('json', createSessionRequestSchema), async c => {
    const userId = c.get('user').uid;
    const body = await c.req.valid('json');

    const created = await createSession({ userId, text: body.text });

    c.status(201);
    return c.json(created);
  })

  // Get session with all data
  .get('/:sessionId', zValidator('param', sessionIdParamSchema), async c => {
    const userId = c.get('user').uid;
    const { sessionId } = c.req.valid('param');

    const session = await getSession({ userId, sessionId });
    if (!session) {
      return c.json({ message: 'Session not found' }, 404);
    }

    return c.json(session);
  })

  // Analyze session
  .post(
    '/:sessionId/analyze',
    zValidator('param', sessionIdParamSchema),
    async c => {
      const userId = c.get('user').uid;
      const { sessionId } = c.req.valid('param');

      // Get the session
      const session = await getSession({ userId, sessionId });
      if (!session) {
        return c.json({ message: 'Session not found' }, 404);
      }

      // Get user preferences
      const tagCounts = await getPreferences(userId);

      // Analyze with AI
      const analysis = await analyzeText(session.text, tagCounts);

      // Save analysis to session
      const updated = await updateSessionAnalysis({
        userId,
        sessionId,
        analysis,
      });

      if (!updated) {
        return c.json({ message: 'Failed to save analysis' }, 500);
      }

      return c.json(analysis);
    },
  )

  // Swipe on a tip
  .post(
    '/:sessionId/tips/:tipId/swipe',
    zValidator('param', tipIdParamSchema),
    zValidator('json', swipeRequestSchema),
    async c => {
      const userId = c.get('user').uid;
      const { sessionId, tipId } = c.req.valid('param');
      const { direction } = c.req.valid('json');

      // Update tip swipe direction
      const result = await updateTipSwipe({
        userId,
        sessionId,
        tipId,
        direction,
      });

      if (!result.success) {
        return c.json({ message: 'Tip not found' }, 404);
      }

      // If right swipe, increment the tag count
      if (direction === 'right' && result.tag) {
        const tagCount = await incrementTag(userId, result.tag);
        return c.json({ success: true, tagCount });
      }

      return c.json({ success: true });
    },
  )

  // Regenerate tips
  .post(
    '/:sessionId/regenerate',
    zValidator('param', sessionIdParamSchema),
    async c => {
      const userId = c.get('user').uid;
      const { sessionId } = c.req.valid('param');

      // Move current tips to previousTips
      const result = await regenerateTips({ userId, sessionId });
      if (!result) {
        return c.json({ message: 'Session not found' }, 404);
      }

      // Get the session for the text
      const session = await getSession({ userId, sessionId });
      if (!session) {
        return c.json({ message: 'Session not found' }, 404);
      }

      // Get user preferences
      const tagCounts = await getPreferences(userId);

      // Generate new analysis with AI
      const analysis = await analyzeText(session.text, tagCounts);

      // Save new analysis to session
      await updateSessionAnalysis({
        userId,
        sessionId,
        analysis,
      });

      return c.json(analysis);
    },
  );
