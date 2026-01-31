import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import {
  setMockUser,
  resetAuthMocks,
  createMockUser,
} from '../mocks/firebase-auth';
import { AuthProvider } from '@/context/auth/AuthContextProvider';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/api/sessions', () => ({
  createSession: vi.fn(),
  analyzeSession: vi.fn(),
}));

import { createSession, analyzeSession } from '@/api/sessions';
const mockCreateSession = vi.mocked(createSession);
const mockAnalyzeSession = vi.mocked(analyzeSession);

function renderHome() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Home />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('Home Page - Brain Dump', () => {
  beforeEach(() => {
    resetAuthMocks();
    setMockUser(createMockUser({ displayName: 'Test User' }));
    vi.clearAllMocks();
  });

  it('should display brain dump title and greeting', async () => {
    renderHome();

    expect(await screen.findByText('Brain Dump')).toBeInTheDocument();
    expect(screen.getByText(/Hey Test/)).toBeInTheDocument();
  });

  it('should display text input area', async () => {
    renderHome();

    expect(
      await screen.findByLabelText('Brain dump text input'),
    ).toBeInTheDocument();
  });

  it('should display input mode toggle buttons', async () => {
    renderHome();

    expect(
      await screen.findByRole('button', { name: /Type it out/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Talk it out/i }),
    ).toBeInTheDocument();
  });

  it('should display submit button', async () => {
    renderHome();

    expect(
      await screen.findByRole('button', { name: /Submit/i }),
    ).toBeInTheDocument();
  });

  it('should display tips library link', async () => {
    renderHome();

    expect(
      await screen.findByRole('button', {
        name: /View My Helpful Tips Library/i,
      }),
    ).toBeInTheDocument();
  });

  it('should enable submit button when text is entered', async () => {
    const user = userEvent.setup();
    renderHome();

    const textarea = await screen.findByLabelText('Brain dump text input');
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    expect(submitButton).toBeDisabled();

    await user.type(textarea, 'I feel overwhelmed today');

    expect(submitButton).not.toBeDisabled();
  });

  it('should create session and navigate when submitted', async () => {
    const user = userEvent.setup();
    mockCreateSession.mockResolvedValueOnce({
      id: 'session-123',
      text: 'I feel overwhelmed today',
      createdAt: new Date().toISOString(),
    });
    mockAnalyzeSession.mockResolvedValueOnce({
      empathy: 'I hear you',
      tips: [],
    });

    renderHome();

    const textarea = await screen.findByLabelText('Brain dump text input');
    await user.type(textarea, 'I feel overwhelmed today');

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateSession).toHaveBeenCalledWith(
        'I feel overwhelmed today',
      );
    });

    await waitFor(() => {
      expect(mockAnalyzeSession).toHaveBeenCalledWith('session-123');
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/session/session-123');
    });
  });

  it('should show loading state while submitting', async () => {
    const user = userEvent.setup();

    let resolvePromise: (value: {
      id: string;
      text: string;
      createdAt: string;
    }) => void;
    const pendingPromise = new Promise<{
      id: string;
      text: string;
      createdAt: string;
    }>(resolve => {
      resolvePromise = resolve;
    });
    mockCreateSession.mockReturnValueOnce(pendingPromise);
    mockAnalyzeSession.mockResolvedValueOnce({
      empathy: 'I hear you',
      tips: [],
    });

    renderHome();

    const textarea = await screen.findByLabelText('Brain dump text input');
    await user.type(textarea, 'I feel overwhelmed today');

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Processing/i)).toBeInTheDocument();
    });

    resolvePromise!({
      id: 'session-123',
      text: 'I feel overwhelmed today',
      createdAt: new Date().toISOString(),
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it('should display character count when text is entered', async () => {
    const user = userEvent.setup();
    renderHome();

    const textarea = await screen.findByLabelText('Brain dump text input');
    await user.type(textarea, 'Hello world');

    expect(screen.getByText('11 characters')).toBeInTheDocument();
  });
});
