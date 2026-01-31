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

describe('Tips API', () => {
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

  describe('GET /api/tips/valuable', () => {
    beforeEach(() => {
      clearFirestore();
    });

    it('should return empty array when no valuable tips exist', async () => {
      const response = await client.authenticatedRequest(
        '/api/tips/valuable',
        validToken,
      );

      expect(response.status).toBe(200);
      const body = await parseJsonResponse<{
        tips: Array<unknown>;
      }>(response);
      expect(body.tips).toEqual([]);
    });

    it('should return tips that were swiped right', async () => {
      // Seed session with right-swiped tips
      seedFirestore(`users/${testUserId}/sessions`, {
        'session-123': {
          text: 'I feel stressed about work.',
          createdAt: MockTimestamp.now(),
          analysis: {
            empathy: 'I understand.',
            tips: [
              {
                id: 'tip_1',
                content: 'Take a break.',
                tag: 'break',
                category: 'immediate',
                priority: 1,
                swipeDirection: 'right',
              },
              {
                id: 'tip_2',
                content: 'Take a walk.',
                tag: 'movement',
                category: 'immediate',
                priority: 2,
                swipeDirection: 'left',
              },
            ],
          },
          previousTips: [],
        },
      });

      const response = await client.authenticatedRequest(
        '/api/tips/valuable',
        validToken,
      );

      expect(response.status).toBe(200);
      const body = await parseJsonResponse<{
        tips: Array<{
          id: string;
          content: string;
          tag: string;
          sessionId: string;
          sessionText: string;
        }>;
      }>(response);
      expect(body.tips).toHaveLength(1);
      expect(body.tips[0].id).toBe('tip_1');
      expect(body.tips[0].content).toBe('Take a break.');
      expect(body.tips[0].tag).toBe('break');
      expect(body.tips[0].sessionId).toBe('session-123');
      expect(body.tips[0].sessionText).toBe('I feel stressed about work.');
    });

    it('should include tips from previousTips batches', async () => {
      // Seed session with previous tips containing right-swiped tips
      seedFirestore(`users/${testUserId}/sessions`, {
        'session-123': {
          text: 'Test text',
          createdAt: MockTimestamp.now(),
          analysis: {
            empathy: 'I understand.',
            tips: [
              {
                id: 'current_tip',
                content: 'Current tip.',
                tag: 'breathe',
                category: 'immediate',
                priority: 1,
                swipeDirection: null,
              },
            ],
          },
          previousTips: [
            {
              generatedAt: MockTimestamp.now(),
              tips: [
                {
                  id: 'old_tip',
                  content: 'Old valuable tip.',
                  tag: 'simplify',
                  category: 'immediate',
                  priority: 1,
                  swipeDirection: 'right',
                },
              ],
            },
          ],
        },
      });

      const response = await client.authenticatedRequest(
        '/api/tips/valuable',
        validToken,
      );

      expect(response.status).toBe(200);
      const body = await parseJsonResponse<{
        tips: Array<{ id: string; content: string }>;
      }>(response);
      expect(body.tips).toHaveLength(1);
      expect(body.tips[0].id).toBe('old_tip');
      expect(body.tips[0].content).toBe('Old valuable tip.');
    });

    it('should aggregate tips from multiple sessions', async () => {
      seedFirestore(`users/${testUserId}/sessions`, {
        'session-1': {
          text: 'Session 1 text',
          createdAt: MockTimestamp.now(),
          analysis: {
            empathy: 'I understand.',
            tips: [
              {
                id: 'tip_s1',
                content: 'Tip from session 1.',
                tag: 'break',
                category: 'immediate',
                priority: 1,
                swipeDirection: 'right',
              },
            ],
          },
          previousTips: [],
        },
        'session-2': {
          text: 'Session 2 text',
          createdAt: MockTimestamp.now(),
          analysis: {
            empathy: 'I hear you.',
            tips: [
              {
                id: 'tip_s2',
                content: 'Tip from session 2.',
                tag: 'movement',
                category: 'immediate',
                priority: 1,
                swipeDirection: 'right',
              },
            ],
          },
          previousTips: [],
        },
      });

      const response = await client.authenticatedRequest(
        '/api/tips/valuable',
        validToken,
      );

      expect(response.status).toBe(200);
      const body = await parseJsonResponse<{
        tips: Array<{ id: string; sessionId: string }>;
      }>(response);
      expect(body.tips).toHaveLength(2);
    });

    it('should return 401 without authentication', async () => {
      const response = await client.get('/api/tips/valuable');

      expect(response.status).toBe(401);
    });
  });
});
