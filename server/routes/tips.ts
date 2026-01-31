import { Hono } from 'hono';
import { getValuableTips } from '../services/sessions';

export const tipsRoute = new Hono()
  // Get all valuable tips (swiped right across all sessions)
  .get('/valuable', async c => {
    const userId = c.get('user').uid;

    const tips = await getValuableTips({ userId });

    return c.json({ tips });
  });
