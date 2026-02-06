import { Hono, type Context } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { sessionsRoute } from './routes/sessions';
import { tipsRoute } from './routes/tips';
import { preferencesRoute } from './routes/preferences';
import env from './env';
import { authenticateUser } from './middlewares/auth/getUser';
const app = new Hono();

app.onError((err: unknown, ctx: Context) => {
  console.log(err);
  if (err instanceof HTTPException) {
    return ctx.json({ error: err.message }, err.status);
  }
  return ctx.json({ error: 'Something went horribly wrong' }, 500);
});

// Middlwares
app.use('*', logger());
app.use('/api/*', authenticateUser);
app.use(
  '*',
  cors({
    origin: origin => {
      if (origin.endsWith('.sandilya.dev')) {
        return origin;
      }
      // Allow Capacitor Android/iOS app
      if (origin === 'https://localhost') {
        return origin;
      }
      return env.FRONTEND_URL;
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: [
      'Access-Control-Allow-Headers',
      'Origin',
      'Accept',
      'X-Requested-With',
      'Content-Type',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
      'Authorization',
    ],
    credentials: true,
  }),
);

const apiRoutes = app
  .get('/health', c => c.text('OK', 201))
  .basePath('/api')
  .route('/sessions', sessionsRoute)
  .route('/tips', tipsRoute)
  .route('/preferences', preferencesRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;
