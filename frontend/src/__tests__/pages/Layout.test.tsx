import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/pages/Layout';
import Home from '@/pages/Home';
import {
  setMockUser,
  resetAuthMocks,
  createMockUser,
} from '../mocks/firebase-auth';
import { AuthProvider } from '@/context/auth/AuthContextProvider';

vi.mock('@/api/sessions', () => ({
  createSession: vi.fn(),
  analyzeSession: vi.fn(),
}));

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('AppLayout - Auth-based Routing', () => {
  beforeEach(() => {
    resetAuthMocks();
  });

  it('should display SignIn page when user is not logged in', async () => {
    setMockUser(null);

    renderLayout();

    expect(await screen.findByText('Welcome')).toBeInTheDocument();
    expect(
      screen.getByText('Sign in to your account to continue'),
    ).toBeInTheDocument();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
  });

  it('should display Home content when user is logged in', async () => {
    const mockUser = createMockUser({
      displayName: 'John Doe',
      email: 'john@example.com',
    });
    setMockUser(mockUser);

    renderLayout();

    expect(await screen.findByText('Brain Dump')).toBeInTheDocument();
    expect(screen.getByText(/Hey John/)).toBeInTheDocument();
  });

  it('should show logout button when user is logged in', async () => {
    setMockUser(createMockUser({ displayName: 'Test User' }));

    renderLayout();

    await screen.findByText('Brain Dump');

    const buttons = screen.getAllByRole('button');
    const logoutButton = buttons.find(btn =>
      btn.querySelector('.lucide-log-out'),
    );
    expect(logoutButton).toBeInTheDocument();
  });
});
