import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

type ListenerCallback = (data: Record<string, unknown>) => void;

const { mockListeners, mockSpeechRecognition } = vi.hoisted(() => {
  type CB = (data: Record<string, unknown>) => void;
  const listeners: Record<string, CB> = {};
  const speechRecognition = {
    available: vi.fn().mockResolvedValue({ available: true }),
    start: vi.fn().mockResolvedValue({}),
    stop: vi.fn().mockResolvedValue(undefined),
    requestPermissions: vi
      .fn()
      .mockResolvedValue({ speechRecognition: 'granted' }),
    addListener: vi.fn((eventName: string, callback: CB) => {
      listeners[eventName] = callback;
      return Promise.resolve({ remove: vi.fn() });
    }),
    removeAllListeners: vi.fn().mockResolvedValue(undefined),
  };
  return { mockListeners: listeners, mockSpeechRecognition: speechRecognition };
});

// Override the global mocks from setup.ts for this file
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: () => true,
  },
}));

vi.mock('@capacitor-community/speech-recognition', () => ({
  SpeechRecognition: mockSpeechRecognition,
}));

// Import after mocks — the module-level isNative will be true
import { useSpeechToText } from '@/hooks/useSpeechToText';

describe('useSpeechToText - Native Capacitor plugin (Android)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(mockListeners).forEach(key => delete mockListeners[key]);
    mockSpeechRecognition.available.mockResolvedValue({ available: true });
    mockSpeechRecognition.requestPermissions.mockResolvedValue({
      speechRecognition: 'granted',
    });
    mockSpeechRecognition.start.mockResolvedValue({});
    mockSpeechRecognition.stop.mockResolvedValue(undefined);
    mockSpeechRecognition.addListener.mockImplementation(
      (eventName: string, callback: ListenerCallback) => {
        mockListeners[eventName] = callback;
        return Promise.resolve({ remove: vi.fn() });
      },
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should check availability and set isSupported', async () => {
    const { result } = renderHook(() => useSpeechToText());

    await waitFor(() => {
      expect(result.current.isSupported).toBe(true);
    });

    expect(mockSpeechRecognition.available).toHaveBeenCalled();
  });

  it('should set isSupported to false when unavailable', async () => {
    mockSpeechRecognition.available.mockResolvedValue({ available: false });

    const { result } = renderHook(() => useSpeechToText());

    await waitFor(() => {
      expect(mockSpeechRecognition.available).toHaveBeenCalled();
    });

    expect(result.current.isSupported).toBe(false);
  });

  it('should register listeners on mount', async () => {
    renderHook(() => useSpeechToText());

    await waitFor(() => {
      expect(mockSpeechRecognition.addListener).toHaveBeenCalledWith(
        'partialResults',
        expect.any(Function),
      );
      expect(mockSpeechRecognition.addListener).toHaveBeenCalledWith(
        'listeningState',
        expect.any(Function),
      );
    });
  });

  it('should remove listeners on unmount', async () => {
    const { unmount } = renderHook(() => useSpeechToText());

    await waitFor(() => {
      expect(mockSpeechRecognition.addListener).toHaveBeenCalled();
    });

    unmount();

    expect(mockSpeechRecognition.removeAllListeners).toHaveBeenCalled();
  });

  it('should request permissions and start recognition', async () => {
    const { result } = renderHook(() => useSpeechToText());

    await waitFor(() => {
      expect(result.current.isSupported).toBe(true);
    });

    await act(async () => {
      result.current.startListening();
    });

    expect(mockSpeechRecognition.requestPermissions).toHaveBeenCalled();
    expect(mockSpeechRecognition.start).toHaveBeenCalledWith({
      language: 'en-US',
      partialResults: true,
      popup: false,
    });
  });

  it('should pass custom language to start()', async () => {
    const { result } = renderHook(() => useSpeechToText({ lang: 'de-DE' }));

    await waitFor(() => {
      expect(result.current.isSupported).toBe(true);
    });

    await act(async () => {
      result.current.startListening();
    });

    expect(mockSpeechRecognition.start).toHaveBeenCalledWith(
      expect.objectContaining({ language: 'de-DE' }),
    );
  });

  it('should set error when permission is denied', async () => {
    mockSpeechRecognition.requestPermissions.mockResolvedValue({
      speechRecognition: 'denied',
    });

    const { result } = renderHook(() => useSpeechToText());

    await waitFor(() => {
      expect(result.current.isSupported).toBe(true);
    });

    await act(async () => {
      result.current.startListening();
    });

    expect(result.current.error).toBe('Speech recognition permission denied');
    expect(mockSpeechRecognition.start).not.toHaveBeenCalled();
  });

  it('should update interimTranscript on partialResults', async () => {
    const { result } = renderHook(() => useSpeechToText());

    await waitFor(() => {
      expect(mockListeners['partialResults']).toBeDefined();
    });

    act(() => {
      mockListeners['partialResults']({ matches: ['Hello'] });
    });

    expect(result.current.interimTranscript).toBe('Hello');
  });

  it('should set isListening on listeningState started', async () => {
    const { result } = renderHook(() => useSpeechToText());

    await waitFor(() => {
      expect(mockListeners['listeningState']).toBeDefined();
    });

    act(() => {
      mockListeners['listeningState']({ status: 'started' });
    });

    expect(result.current.isListening).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should promote partial result to transcript on stop', async () => {
    const { result } = renderHook(() => useSpeechToText());

    await waitFor(() => {
      expect(mockListeners['partialResults']).toBeDefined();
      expect(mockListeners['listeningState']).toBeDefined();
    });

    // Verify listeningState started works
    act(() => {
      mockListeners['listeningState']({ status: 'started' });
    });
    expect(result.current.isListening).toBe(true);

    // Set partial results
    act(() => {
      mockListeners['partialResults']({ matches: ['Hello world'] });
    });
    expect(result.current.interimTranscript).toBe('Hello world');

    // Fire stopped — should promote partial to transcript
    await act(async () => {
      mockListeners['listeningState']({ status: 'stopped' });
    });

    expect(result.current.transcript).toBe('Hello world');
    expect(result.current.interimTranscript).toBe('');
    expect(result.current.isListening).toBe(false);
  });

  it('should call SpeechRecognition.stop() when stopListening is called', async () => {
    const { result } = renderHook(() => useSpeechToText());

    await act(async () => {
      result.current.stopListening();
    });

    expect(mockSpeechRecognition.stop).toHaveBeenCalled();
  });

  it('should reset transcript and interimTranscript on resetTranscript', async () => {
    const { result } = renderHook(() => useSpeechToText());

    await waitFor(() => {
      expect(mockListeners['partialResults']).toBeDefined();
      expect(mockListeners['listeningState']).toBeDefined();
    });

    act(() => {
      mockListeners['partialResults']({ matches: ['some text'] });
    });

    act(() => {
      mockListeners['listeningState']({ status: 'stopped' });
    });

    await waitFor(() => {
      expect(result.current.transcript).toBe('some text');
    });

    act(() => {
      result.current.resetTranscript();
    });

    expect(result.current.transcript).toBe('');
    expect(result.current.interimTranscript).toBe('');
  });

  it('should set error when not supported and startListening is called', async () => {
    mockSpeechRecognition.available.mockResolvedValue({ available: false });

    const { result } = renderHook(() => useSpeechToText());

    await waitFor(() => {
      expect(mockSpeechRecognition.available).toHaveBeenCalled();
    });

    await act(async () => {
      result.current.startListening();
    });

    expect(result.current.error).toBe(
      'Speech recognition is not supported on this device',
    );
  });
});
