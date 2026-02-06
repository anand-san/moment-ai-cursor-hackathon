import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock Capacitor to return web platform by default
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: () => false,
  },
}));

vi.mock('@capacitor/app', () => ({
  App: {
    addListener: vi.fn().mockResolvedValue({ remove: vi.fn() }),
  },
}));

vi.mock('@capacitor-firebase/authentication', () => ({
  FirebaseAuthentication: {
    signInWithGoogle: vi.fn().mockResolvedValue({
      credential: { idToken: 'mock-id-token' },
    }),
  },
}));

vi.mock('@capacitor-community/speech-recognition', () => ({
  SpeechRecognition: {
    available: vi.fn().mockResolvedValue({ available: false }),
    start: vi.fn().mockResolvedValue({}),
    stop: vi.fn().mockResolvedValue(undefined),
    requestPermissions: vi
      .fn()
      .mockResolvedValue({ speechRecognition: 'granted' }),
    addListener: vi.fn().mockResolvedValue({ remove: vi.fn() }),
    removeAllListeners: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.stubEnv('VITE_APP_URL', 'https://momentai.sandilya.dev');
vi.stubEnv('VITE_FIREBASE_API_KEY', 'test-api-key');
vi.stubEnv('VITE_FIREBASE_AUTH_DOMAIN', 'test.firebaseapp.com');
vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'test-project');
vi.stubEnv('VITE_FIREBASE_APP_ID', 'test-app-id');

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
  getApps: vi.fn(() => []),
}));

vi.mock('firebase/auth', async () => {
  const { mockAuth, mockOnAuthStateChanged } = await import(
    './mocks/firebase-auth'
  );
  return {
    getAuth: vi.fn(() => mockAuth),
    onAuthStateChanged: mockOnAuthStateChanged,
    signInWithPopup: vi.fn(),
    signInWithCredential: vi.fn(),
    signOut: vi.fn(() => Promise.resolve()),
    GoogleAuthProvider: Object.assign(vi.fn(), {
      credential: vi.fn().mockReturnValue({ providerId: 'google.com' }),
    }),
    sendSignInLinkToEmail: vi.fn(() => Promise.resolve()),
    isSignInWithEmailLink: vi.fn(() => false),
    signInWithEmailLink: vi.fn(),
  };
});
