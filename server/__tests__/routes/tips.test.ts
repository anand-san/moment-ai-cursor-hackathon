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
            identifiedProblems: ['Work stress'],
            tips: [
              {
                id: 'tip_1',
                title: 'Take a break',
                description: 'Step away from your desk for 5 minutes.',
                tag: 'break',
                category: 'immediate',
                priority: 1,
                timeEstimate: '5 min',
                actionType: 'timer',
                swipeDirection: 'right',
              },
              {
                id: 'tip_2',
                title: 'Take a walk',
                description: 'Get some fresh air outside.',
                tag: 'movement',
                category: 'immediate',
                priority: 2,
                timeEstimate: '10 min',
                actionType: 'none',
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
          title: string;
          description: string;
          tag: string;
          sessionId: string;
          sessionText: string;
        }>;
      }>(response);
      expect(body.tips).toHaveLength(1);
      expect(body.tips[0].id).toBe('tip_1');
      expect(body.tips[0].title).toBe('Take a break');
      expect(body.tips[0].description).toBe(
        'Step away from your desk for 5 minutes.',
      );
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
            identifiedProblems: ['Some problem'],
            tips: [
              {
                id: 'current_tip',
                title: 'Current tip',
                description: 'This is the current tip.',
                tag: 'breathe',
                category: 'immediate',
                priority: 1,
                timeEstimate: '30 sec',
                actionType: 'timer',
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
                  title: 'Old valuable tip',
                  description: 'This was a helpful old tip.',
                  tag: 'simplify',
                  category: 'immediate',
                  priority: 1,
                  timeEstimate: '2 min',
                  actionType: 'none',
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
        tips: Array<{ id: string; title: string; description: string }>;
      }>(response);
      expect(body.tips).toHaveLength(1);
      expect(body.tips[0].id).toBe('old_tip');
      expect(body.tips[0].title).toBe('Old valuable tip');
      expect(body.tips[0].description).toBe('This was a helpful old tip.');
    });

    it('should aggregate tips from multiple sessions', async () => {
      seedFirestore(`users/${testUserId}/sessions`, {
        'session-1': {
          text: 'Session 1 text',
          createdAt: MockTimestamp.now(),
          analysis: {
            empathy: 'I understand.',
            identifiedProblems: ['Problem 1'],
            tips: [
              {
                id: 'tip_s1',
                title: 'Tip from session 1',
                description: 'Description for session 1 tip.',
                tag: 'break',
                category: 'immediate',
                priority: 1,
                timeEstimate: '5 min',
                actionType: 'none',
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
            identifiedProblems: ['Problem 2'],
            tips: [
              {
                id: 'tip_s2',
                title: 'Tip from session 2',
                description: 'Description for session 2 tip.',
                tag: 'movement',
                category: 'immediate',
                priority: 1,
                timeEstimate: '10 min',
                actionType: 'none',
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
