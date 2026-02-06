import { describe, it, expect } from 'vitest';
import { getAppUrl } from '@/utils/platform';

describe('getAppUrl', () => {
  it('should return VITE_APP_URL when set', () => {
    // VITE_APP_URL is stubbed in setup.ts
    expect(getAppUrl()).toBe('https://momentai.sandilya.dev');
  });
});
