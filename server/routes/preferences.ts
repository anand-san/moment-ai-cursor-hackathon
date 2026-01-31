import { Hono } from 'hono';
import { getPreferences } from '../services/preferences';

export const preferencesRoute = new Hono()
  // Get user preferences (tag counts)
  .get('/', async c => {
    const userId = c.get('user').uid;

    const tagCounts = await getPreferences(userId);

    return c.json({ tagCounts });
  });
