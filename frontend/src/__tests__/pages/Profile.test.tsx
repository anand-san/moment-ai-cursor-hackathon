import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Profile from '@/pages/Profile';
import {
  setMockUser,
  resetAuthMocks,
  createMockUser,
} from '../mocks/firebase-auth';
import { AuthProvider } from '@/context/auth/AuthContextProvider';
import { ThemeProvider } from '@/context/theme/ThemeProvider';

function renderProfile() {
  return render(
    <MemoryRouter initialEntries={['/profile']}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <Routes>
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('Profile Page', () => {
  beforeEach(() => {
    resetAuthMocks();
  });

  it('should display user name and email', async () => {
    const mockUser = createMockUser({
      displayName: 'John Doe',
      email: 'john@example.com',
    });
    setMockUser(mockUser);

    renderProfile();

    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should display "Anonymous User" when displayName is missing', async () => {
    const mockUser = createMockUser({
      displayName: null,
      email: 'test@example.com',
    });
    setMockUser(mockUser);

    renderProfile();

    expect(await screen.findByText('Anonymous User')).toBeInTheDocument();
  });

  it('should display theme options', async () => {
    setMockUser(createMockUser({ displayName: 'Test User' }));

    renderProfile();

    expect(await screen.findByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('should display sign out button', async () => {
    setMockUser(createMockUser({ displayName: 'Test User' }));

    renderProfile();

    expect(await screen.findByText('Sign Out')).toBeInTheDocument();
  });

  it('should allow changing theme', async () => {
    setMockUser(createMockUser({ displayName: 'Test User' }));

    renderProfile();

    const darkButton = await screen.findByText('Dark');
    fireEvent.click(darkButton);

    // Theme button should be clickable and update the theme (selected state has primary background)
    expect(darkButton.closest('button')).toHaveClass('bg-primary/10');
  });
});
