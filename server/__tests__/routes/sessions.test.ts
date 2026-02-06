import { describe, it, expect, beforeEach } from 'bun:test';
import app from '../../app';
import { createTestClient, parseJsonResponse } from '../utils/test-client';
import {
  setMockVerifyIdToken,
  resetAllMocks,
  seedFirestore,
  getFirestoreData,
  clearFirestore,
  MockTimestamp,
} from '../mocks/firebase-admin';
import { resetOpenAIMocks } from '../mocks/openai';

describe('Sessions API', () => {
  const client = createTestClient(app);
  const validToken = 'valid-test-token';
  const testUserId = 'test-user-123';

  beforeEach(() => {
    resetAllMocks();
    resetOpenAIMocks();
    setMockVerifyIdToken({
      uid: testUserId,
      email: 'test@example.com',
      name: 'Test User',
    });
  });

  describe('POST /api/sessions (Create Session)', () => {
    beforeEach(() => {
      clearFirestore();
    });

    it('should create a new session with brain dump text', async () => {
      const response = await client.authenticatedRequest(
        '/api/sessions',
        validToken,
        {
          method: 'POST',
          body: { text: 'I feel overwhelmed with all my tasks today.' },
        },
      );

      expect(response.status).toBe(201);
      const body = await parseJsonResponse<{
        id: string;
        text: string;
        createdAt: string;
      }>(response);
      expect(body.id).toBeDefined();
      expect(body.text).toBe('I feel overwhelmed with all my tasks today.');
      expect(body.createdAt).toBeDefined();
    });

    it('should return 400 for missing text', async () => {
      const response = await client.authenticatedRequest(
        '/api/sessions',
        validToken,
        {
          method: 'POST',
          body: {},
        },
      );

      expect(response.status).toBe(400);
    });

    it('should return 400 for empty text', async () => {
      const response = await client.authenticatedRequest(
        '/api/sessions',
        validToken,
        {
          method: 'POST',
          body: { text: '' },
        },
      );

      expect(response.status).toBe(400);
    });

    it('should return 401 without authentication', async () => {
      const response = await client.post('/api/sessions', {
        text: 'Test text',
      });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/sessions/:sessionId', () => {
    beforeEach(() => {
      clearFirestore();
    });

    it('should return a session with its analysis', async () => {
      const sessionData = {
        text: 'Test brain dump',
        createdAt: MockTimestamp.now(),
        analysis: {
          empathy: 'I understand.',
          identifiedProblems: ['Feeling overwhelmed'],
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
              swipeDirection: null,
            },
          ],
        },
        previousTips: [],
      };

      seedFirestore(`users/${testUserId}/sessions`, {
        'session-123': sessionData,
      });

      const response = await client.authenticatedRequest(
        '/api/sessions/session-123',
        validToken,
      );

      expect(response.status).toBe(200);
      const body = await parseJsonResponse<{
        id: string;
        text: string;
        analysis: { empathy: string };
      }>(response);
      expect(body.id).toBe('session-123');
      expect(body.text).toBe('Test brain dump');
      expect(body.analysis.empathy).toBe('I understand.');
    });

    it('should return 404 for non-existent session', async () => {
      const response = await client.authenticatedRequest(
        '/api/sessions/non-existent',
        validToken,
      );

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/sessions/:sessionId/analyze', () => {
    beforeEach(() => {
      clearFirestore();
    });

    it('should analyze a session and return tips', async () => {
      // Seed session
      seedFirestore(`users/${testUserId}/sessions`, {
        'session-123': {
          text: 'I feel stressed about work.',
          createdAt: MockTimestamp.now(),
          analysis: null,
          previousTips: [],
        },
      });

      // Seed default preferences
      seedFirestore(`users/${testUserId}/preferences`, {
        preferences: {
          tagCounts: {
            break: 0,
            movement: 0,
            breathe: 0,
            simplify: 0,
            environment: 0,
            social: 0,
            timer: 0,
            reward: 0,
            acceptance: 0,
          },
          updatedAt: MockTimestamp.now(),
        },
      });

      const response = await client.authenticatedRequest(
        '/api/sessions/session-123/analyze',
        validToken,
        {
          method: 'POST',
        },
      );

      expect(response.status).toBe(200);
      const body = await parseJsonResponse<{
        empathy: string;
        identifiedProblems: string[];
        tips: Array<{ id: string; title: string; tag: string }>;
      }>(response);
      expect(body.empathy).toBeDefined();
      expect(body.identifiedProblems).toBeDefined();
      expect(body.tips).toHaveLength(2);
      expect(body.tips[0].tag).toBe('breathe');
      expect(body.tips[0].title).toBeDefined();
    });

    it('should return 404 for non-existent session', async () => {
      const response = await client.authenticatedRequest(
        '/api/sessions/non-existent/analyze',
        validToken,
        {
          method: 'POST',
        },
      );

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/sessions/:sessionId/tips/:tipId/swipe', () => {
    beforeEach(() => {
      clearFirestore();
    });

    it('should update tip swipe direction to right and increment tag', async () => {
      // Seed session with analysis
      seedFirestore(`users/${testUserId}/sessions`, {
        'session-123': {
          text: 'Test text',
          createdAt: MockTimestamp.now(),
          analysis: {
            empathy: 'I understand.',
            identifiedProblems: ['Feeling stressed'],
            tips: [
              {
                id: 'tip_1',
                title: 'Take a break',
                description: 'Step away for 5 minutes.',
                tag: 'break',
                category: 'immediate',
                priority: 1,
                timeEstimate: '5 min',
                actionType: 'none',
                swipeDirection: null,
              },
            ],
          },
          previousTips: [],
        },
      });

      // Seed preferences
      seedFirestore(`users/${testUserId}/preferences`, {
        preferences: {
          tagCounts: {
            break: 0,
            movement: 0,
            breathe: 0,
            simplify: 0,
            environment: 0,
            social: 0,
            timer: 0,
            reward: 0,
            acceptance: 0,
          },
          updatedAt: MockTimestamp.now(),
        },
      });

      const response = await client.authenticatedRequest(
        '/api/sessions/session-123/tips/tip_1/swipe',
        validToken,
        {
          method: 'POST',
          body: { direction: 'right' },
        },
      );

      expect(response.status).toBe(200);
      const body = await parseJsonResponse<{
        success: boolean;
        tagCount?: number;
      }>(response);
      expect(body.success).toBe(true);
      expect(body.tagCount).toBe(1);

      // Verify preferences were updated
      const prefs = getFirestoreData(`users/${testUserId}/preferences`);
      expect(
        (prefs['preferences'] as { tagCounts: { break: number } }).tagCounts
          .break,
      ).toBe(1);
    });

    it('should update tip swipe direction to left without incrementing tag', async () => {
      // Seed session with analysis
      seedFirestore(`users/${testUserId}/sessions`, {
        'session-123': {
          text: 'Test text',
          createdAt: MockTimestamp.now(),
          analysis: {
            empathy: 'I understand.',
            identifiedProblems: ['Feeling stressed'],
            tips: [
              {
                id: 'tip_1',
                title: 'Take a break',
                description: 'Step away for 5 minutes.',
                tag: 'break',
                category: 'immediate',
                priority: 1,
                timeEstimate: '5 min',
                actionType: 'none',
                swipeDirection: null,
              },
            ],
          },
          previousTips: [],
        },
      });

      const response = await client.authenticatedRequest(
        '/api/sessions/session-123/tips/tip_1/swipe',
        validToken,
        {
          method: 'POST',
          body: { direction: 'left' },
        },
      );

      expect(response.status).toBe(200);
      const body = await parseJsonResponse<{
        success: boolean;
        tagCount?: number;
      }>(response);
      expect(body.success).toBe(true);
      expect(body.tagCount).toBeUndefined();
    });

    it('should return 404 for non-existent tip', async () => {
      // Seed session with analysis
      seedFirestore(`users/${testUserId}/sessions`, {
        'session-123': {
          text: 'Test text',
          createdAt: MockTimestamp.now(),
          analysis: {
            empathy: 'I understand.',
            identifiedProblems: [],
            tips: [],
          },
          previousTips: [],
        },
      });

      const response = await client.authenticatedRequest(
        '/api/sessions/session-123/tips/non-existent/swipe',
        validToken,
        {
          method: 'POST',
          body: { direction: 'right' },
        },
      );

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/sessions/:sessionId/regenerate', () => {
    beforeEach(() => {
      clearFirestore();
    });

    it('should regenerate tips and preserve old tips in history', async () => {
      // Seed session with existing analysis
      seedFirestore(`users/${testUserId}/sessions`, {
        'session-123': {
          text: 'Test text',
          createdAt: MockTimestamp.now(),
          analysis: {
            empathy: 'Old empathy.',
            identifiedProblems: ['Old problem'],
            tips: [
              {
                id: 'old_tip_1',
                title: 'Old tip',
                description: 'This is an old tip.',
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
      });

      // Seed preferences
      seedFirestore(`users/${testUserId}/preferences`, {
        preferences: {
          tagCounts: {
            break: 1,
            movement: 0,
            breathe: 0,
            simplify: 0,
            environment: 0,
            social: 0,
            timer: 0,
            reward: 0,
            acceptance: 0,
          },
          updatedAt: MockTimestamp.now(),
        },
      });

      const response = await client.authenticatedRequest(
        '/api/sessions/session-123/regenerate',
        validToken,
        {
          method: 'POST',
        },
      );

      expect(response.status).toBe(200);
      const body = await parseJsonResponse<{
        empathy: string;
        tips: Array<{ id: string }>;
      }>(response);
      expect(body.empathy).toBe('I understand this is challenging.');
      expect(body.tips.length).toBeGreaterThan(0);

      // Verify old tips are preserved in previousTips
      const sessions = getFirestoreData(`users/${testUserId}/sessions`);
      const session = sessions['session-123'] as {
        previousTips: Array<{ tips: Array<{ id: string }> }>;
      };
      expect(session.previousTips.length).toBeGreaterThan(0);
    });

    it('should return 404 for non-existent session', async () => {
      const response = await client.authenticatedRequest(
        '/api/sessions/non-existent/regenerate',
        validToken,
        {
          method: 'POST',
        },
      );

      expect(response.status).toBe(404);
    });
  });
});
