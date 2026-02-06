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
}));

import { createSession } from '@/api/sessions';
const mockCreateSession = vi.mocked(createSession);

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

  it('should display main title', async () => {
    renderHome();

    expect(
      await screen.findByText("What's on your mind?"),
    ).toBeInTheDocument();
  });

  it('should display text input area', async () => {
    renderHome();

    expect(
      await screen.findByLabelText('Brain dump text input'),
    ).toBeInTheDocument();
  });

  it('should display voice and keyboard toggle', async () => {
    renderHome();

    // Voice mode is default - mic button and keyboard toggle should be present
    expect(
      await screen.findByText('Tap to speak'),
    ).toBeInTheDocument();
  });

  it('should display submit button', async () => {
    renderHome();

    expect(
      await screen.findByRole('button', { name: /Submit/i }),
    ).toBeInTheDocument();
  });

  it('should display cancel button in typing mode', async () => {
    renderHome();

    // Cancel button is rendered (in typing mode overlay)
    expect(await screen.findByText('Cancel')).toBeInTheDocument();
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
