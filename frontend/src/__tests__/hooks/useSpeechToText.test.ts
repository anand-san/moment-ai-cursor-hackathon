import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSpeechToText } from '@/hooks/useSpeechToText';

describe('useSpeechToText', () => {
  let mockRecognitionInstance: {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    abort: ReturnType<typeof vi.fn>;
    onresult: ((event: unknown) => void) | null;
    onerror: ((event: unknown) => void) | null;
    onend: (() => void) | null;
    onstart: (() => void) | null;
  };

  class MockSpeechRecognition {
    continuous = false;
    interimResults = false;
    lang = '';
    start = vi.fn();
    stop = vi.fn();
    abort = vi.fn();
    onresult: ((event: unknown) => void) | null = null;
    onerror: ((event: unknown) => void) | null = null;
    onend: (() => void) | null = null;
    onstart: (() => void) | null = null;

    constructor() {
      mockRecognitionInstance = this;
    }
  }

  beforeEach(() => {
    vi.stubGlobal('webkitSpeechRecognition', MockSpeechRecognition);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('should return isSupported as true when Speech API is available', () => {
    const { result } = renderHook(() => useSpeechToText());

    expect(result.current.isSupported).toBe(true);
  });

  it('should return isSupported as false when Speech API is not available', () => {
    vi.unstubAllGlobals();

    const { result } = renderHook(() => useSpeechToText());

    expect(result.current.isSupported).toBe(false);
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useSpeechToText());

    expect(result.current.isListening).toBe(false);
    expect(result.current.transcript).toBe('');
    expect(result.current.interimTranscript).toBe('');
    expect(result.current.error).toBe(null);
  });

  it('should call recognition.start when startListening is called', () => {
    const { result } = renderHook(() => useSpeechToText());

    act(() => {
      result.current.startListening();
    });

    expect(mockRecognitionInstance.start).toHaveBeenCalled();
  });

  it('should call recognition.stop when stopListening is called', () => {
    const { result } = renderHook(() => useSpeechToText());

    act(() => {
      result.current.stopListening();
    });

    expect(mockRecognitionInstance.stop).toHaveBeenCalled();
  });

  it('should reset transcript when resetTranscript is called', () => {
    const { result } = renderHook(() => useSpeechToText());

    // Simulate some transcript being set
    act(() => {
      if (mockRecognitionInstance.onresult) {
        mockRecognitionInstance.onresult({
          resultIndex: 0,
          results: [
            {
              isFinal: true,
              0: { transcript: 'Hello world' },
              length: 1,
            },
          ],
        });
      }
    });

    act(() => {
      result.current.resetTranscript();
    });

    expect(result.current.transcript).toBe('');
    expect(result.current.interimTranscript).toBe('');
  });

  it('should set isListening to true on recognition start', () => {
    const { result } = renderHook(() => useSpeechToText());

    act(() => {
      if (mockRecognitionInstance.onstart) {
        mockRecognitionInstance.onstart();
      }
    });

    expect(result.current.isListening).toBe(true);
  });

  it('should set isListening to false on recognition end', () => {
    const { result } = renderHook(() => useSpeechToText());

    act(() => {
      if (mockRecognitionInstance.onstart) {
        mockRecognitionInstance.onstart();
      }
    });

    expect(result.current.isListening).toBe(true);

    act(() => {
      if (mockRecognitionInstance.onend) {
        mockRecognitionInstance.onend();
      }
    });

    expect(result.current.isListening).toBe(false);
  });

  it('should set error on recognition error', () => {
    const { result } = renderHook(() => useSpeechToText());

    act(() => {
      if (mockRecognitionInstance.onerror) {
        mockRecognitionInstance.onerror({
          error: 'no-speech',
          message: 'No speech detected',
        });
      }
    });

    expect(result.current.error).toBe('no-speech');
    expect(result.current.isListening).toBe(false);
  });

  it('should use custom language option', () => {
    renderHook(() => useSpeechToText({ lang: 'es-ES' }));

    expect(mockRecognitionInstance.lang).toBe('es-ES');
  });

  it('should configure continuous and interimResults options', () => {
    renderHook(() =>
      useSpeechToText({ continuous: false, interimResults: false }),
    );

    expect(mockRecognitionInstance.continuous).toBe(false);
    expect(mockRecognitionInstance.interimResults).toBe(false);
  });
});
