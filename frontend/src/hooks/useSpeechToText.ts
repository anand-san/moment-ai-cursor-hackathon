import { useState, useCallback, useRef, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

// Web Speech API type declarations
interface WebSpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface WebSpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface WebSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: WebSpeechRecognitionEvent) => void) | null;
  onerror: ((event: WebSpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => WebSpeechRecognition;
    webkitSpeechRecognition: new () => WebSpeechRecognition;
  }
}

interface UseSpeechToTextOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

interface UseSpeechToTextReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechToText(
  options: UseSpeechToTextOptions = {},
): UseSpeechToTextReturn {
  const {
    lang = 'en-US',
    continuous = true,
    interimResults: interimResultsOpt = true,
  } = options;

  const isNative = Capacitor.isNativePlatform();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [nativeSupported, setNativeSupported] = useState(false);

  // Native refs
  const lastPartialRef = useRef('');

  // Web refs
  const recognitionRef = useRef<WebSpeechRecognition | null>(null);

  const webSupported =
    !isNative &&
    typeof window !== 'undefined' &&
    (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);

  const isSupported = isNative ? nativeSupported : webSupported;

  // === Native setup ===
  useEffect(() => {
    if (!isNative) return;
    SpeechRecognition.available().then(({ available }) => {
      setNativeSupported(available);
    });
  }, [isNative]);

  useEffect(() => {
    if (!isNative) return;

    const setupListeners = async () => {
      await SpeechRecognition.addListener('partialResults', data => {
        const text = data.matches?.[0] ?? '';
        lastPartialRef.current = text;
        setInterimTranscript(text);
      });

      await SpeechRecognition.addListener('listeningState', data => {
        if (data.status === 'started') {
          setIsListening(true);
          setError(null);
        } else if (data.status === 'stopped') {
          setIsListening(false);
          if (lastPartialRef.current) {
            const finalText = lastPartialRef.current;
            lastPartialRef.current = '';
            setTranscript(prev => (prev ? prev + ' ' + finalText : finalText));
          }
          setInterimTranscript('');
        }
      });
    };

    setupListeners();

    return () => {
      SpeechRecognition.removeAllListeners();
    };
  }, [isNative]);

  // === Web setup ===
  useEffect(() => {
    if (isNative || !webSupported) return;

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognitionAPI();

    const recognition = recognitionRef.current;
    recognition.continuous = continuous;
    recognition.interimResults = interimResultsOpt;
    recognition.lang = lang;

    recognition.onresult = (event: WebSpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: WebSpeechRecognitionErrorEvent) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isNative, webSupported, continuous, interimResultsOpt, lang]);

  // === Start listening ===
  const startListening = useCallback(async () => {
    if (isNative) {
      if (!nativeSupported) {
        setError('Speech recognition is not supported on this device');
        return;
      }
      setError(null);
      try {
        const permResult = await SpeechRecognition.requestPermissions();
        if (permResult.speechRecognition !== 'granted') {
          setError('Speech recognition permission denied');
          return;
        }
        await SpeechRecognition.start({
          language: lang,
          partialResults: true,
          popup: false,
        });
      } catch (e) {
        setError(
          e instanceof Error ? e.message : 'Failed to start speech recognition',
        );
      }
    } else {
      if (!webSupported || !recognitionRef.current) {
        setError('Speech recognition is not supported in this browser');
        return;
      }
      setError(null);
      try {
        recognitionRef.current.start();
      } catch {
        // Already started - ignore
      }
    }
  }, [isNative, nativeSupported, webSupported, lang]);

  // === Stop listening ===
  const stopListening = useCallback(async () => {
    if (isNative) {
      try {
        await SpeechRecognition.stop();
      } catch {
        // Already stopped - ignore
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  }, [isNative]);

  // === Reset transcript ===
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    lastPartialRef.current = '';
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}
