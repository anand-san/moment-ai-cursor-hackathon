import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { AuthError } from 'firebase/auth';
import { useSendEmailLink } from '@/components/auth/hooks/useSendEmailLink';
import { sendSignInLinkToEmail } from 'firebase/auth';

describe('useSendEmailLink', () => {
  const onError = vi.fn();
  const onEmailSent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it('should send email link with correct URL', async () => {
    const { result } = renderHook(() =>
      useSendEmailLink({ onError, onEmailSent }),
    );

    await act(async () => {
      await result.current.sendEmailLink('test@example.com');
    });

    expect(sendSignInLinkToEmail).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      expect.objectContaining({
        url: expect.stringContaining('https://momentai.sandilya.dev'),
        handleCodeInApp: true,
      }),
    );
    expect(onEmailSent).toHaveBeenCalledWith('test@example.com');
  });

  it('should store email in localStorage', async () => {
    const { result } = renderHook(() =>
      useSendEmailLink({ onError, onEmailSent }),
    );

    await act(async () => {
      await result.current.sendEmailLink('test@example.com');
    });

    expect(window.localStorage.getItem('emailForSignIn')).toBe(
      'test@example.com',
    );
  });

  it('should call onError when sending fails', async () => {
    const mockError = new Error('Send failed') as AuthError;
    vi.mocked(sendSignInLinkToEmail).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() =>
      useSendEmailLink({ onError, onEmailSent }),
    );

    await act(async () => {
      await result.current.sendEmailLink('test@example.com');
    });

    expect(onError).toHaveBeenCalledWith(mockError);
    expect(onEmailSent).not.toHaveBeenCalled();
  });

  it('should manage loading state', async () => {
    const { result } = renderHook(() =>
      useSendEmailLink({ onError, onEmailSent }),
    );

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      await result.current.sendEmailLink('test@example.com');
    });

    expect(result.current.isLoading).toBe(false);
  });
});
