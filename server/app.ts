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

// Middlewares — CORS must come before auth so preflight OPTIONS requests
// get proper headers without needing an auth token
app.use('*', logger());
app.use('/api/*', async (c, next) => {
  const origin = c.req.header('origin') ?? 'none';
  const host = c.req.header('host') ?? 'none';
  const xForwardedHost = c.req.header('x-forwarded-host') ?? 'none';
  const xForwardedProto = c.req.header('x-forwarded-proto') ?? 'none';
  const userAgent = c.req.header('user-agent') ?? 'none';
  const uaLower = userAgent.toLowerCase();
  const isLikelyNative =
    origin === 'https://localhost' ||
    origin === 'capacitor://localhost' ||
    uaLower.includes('capacitor') ||
    uaLower.includes('android') ||
    uaLower.includes('; wv');

  console.log(
    `[api-debug] method=${c.req.method} path=${c.req.path} origin=${origin} host=${host} x-forwarded-host=${xForwardedHost} x-forwarded-proto=${xForwardedProto} likely-native=${isLikelyNative}`,
  );

  await next();
});
app.use(
  '*',
  cors({
    origin: origin => {
      if (!origin) {
        return env.FRONTEND_URL;
      }

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
app.use('/api/*', authenticateUser);

const apiRoutes = app
  .get('/health', c => c.text('OK', 201))
  .basePath('/api')
  .route('/sessions', sessionsRoute)
  .route('/tips', tipsRoute)
  .route('/preferences', preferencesRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;
