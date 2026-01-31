import { describe, it, expect, beforeEach } from 'bun:test';
import app from '../../app';
import { createTestClient, parseJsonResponse } from '../utils/test-client';
import {
  setMockVerifyIdToken,
  resetAllMocks,
  seedFirestore,
  clearFirestore,
  MockTimestamp,
} from '../mocks/firebase-admin';

describe('Preferences API', () => {
  const client = createTestClient(app);
  const validToken = 'valid-test-token';
  const testUserId = 'test-user-123';

  beforeEach(() => {
    resetAllMocks();
    setMockVerifyIdToken({
      uid: testUserId,
      email: 'test@example.com',
      name: 'Test User',
    });
  });

  describe('GET /api/preferences', () => {
    beforeEach(() => {
      clearFirestore();
    });

    it('should return default tag counts for new user', async () => {
      const response = await client.authenticatedRequest(
        '/api/preferences',
        validToken,
      );

      expect(response.status).toBe(200);
      const body = await parseJsonResponse<{
        tagCounts: Record<string, number>;
      }>(response);
      expect(body.tagCounts).toBeDefined();
      expect(body.tagCounts.break).toBe(0);
      expect(body.tagCounts.movement).toBe(0);
      expect(body.tagCounts.breathe).toBe(0);
      expect(body.tagCounts.simplify).toBe(0);
      expect(body.tagCounts.environment).toBe(0);
      expect(body.tagCounts.social).toBe(0);
      expect(body.tagCounts.timer).toBe(0);
      expect(body.tagCounts.reward).toBe(0);
      expect(body.tagCounts.acceptance).toBe(0);
    });

    it('should return existing tag counts for user with preferences', async () => {
      // Seed existing preferences
      seedFirestore(`users/${testUserId}`, {
        preferences: {
          tagCounts: {
            break: 5,
            movement: 3,
            breathe: 10,
            simplify: 2,
            environment: 0,
            social: 1,
            timer: 4,
            reward: 0,
            acceptance: 7,
          },
          updatedAt: MockTimestamp.now(),
        },
      });

      const response = await client.authenticatedRequest(
        '/api/preferences',
        validToken,
      );

      expect(response.status).toBe(200);
      const body = await parseJsonResponse<{
        tagCounts: Record<string, number>;
      }>(response);
      expect(body.tagCounts.break).toBe(5);
      expect(body.tagCounts.movement).toBe(3);
      expect(body.tagCounts.breathe).toBe(10);
      expect(body.tagCounts.acceptance).toBe(7);
    });

    it('should return 401 without authentication', async () => {
      const response = await client.get('/api/preferences');

      expect(response.status).toBe(401);
    });
  });
});
