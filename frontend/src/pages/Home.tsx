import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { createSession } from '@/api/sessions';
import { toast } from 'sonner';
import { useVoice } from './Layout';
import { ChevronLeft } from 'lucide-react';
import { VoiceButton } from '@/components/ios/VoiceButton';

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const {
    isRecording: isRecordingContext,
    setIsRecording,
    startRecording,
    stopRecording,
  } = useVoice();

  // Check if we came from a session (for back button)
  const showBackButton = location.state?.fromSession === true;

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    isSupported,
    resetTranscript,
  } = useSpeechToText({ lang: 'en-US' });

  // Sync recording state with voice context
  useEffect(() => {
    if (isListening) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isListening, startRecording, stopRecording]);

  // Recording timer
  useEffect(() => {
    if (isListening) {
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isListening]);

  const handlePressStart = useCallback(() => {
    console.log('🎤 handlePressStart called', { isSupported, isProcessing });
    if (!isSupported || isProcessing) {
      if (!isSupported) {
        toast.error('Speech recognition is not supported in this browser.');
      }
      return;
    }
    setRecordingDuration(0);
    resetTranscript?.();
    startListening();
  }, [isSupported, isProcessing, startListening, resetTranscript]);

  const handlePressEnd = useCallback(async () => {
    console.log('🛑 handlePressEnd called', {
      isListening,
      transcript,
      interimTranscript,
      isProcessing,
    });
    if (!isListening) {
      console.log('❌ Not listening, skipping handlePressEnd');
      return; // Guard: only process if we're actually recording
    }

    stopListening();
    setIsProcessing(true);

    // Wait longer for final transcript (speech recognition needs time)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Use transcript or interimTranscript as fallback
    const finalText = transcript.trim() || interimTranscript.trim();
    console.log('📝 Final transcript:', finalText, {
      transcript,
      interimTranscript,
    });

    if (!finalText) {
      console.log('⚠️ No text detected');
      toast.error('No speech detected. Please try again.');
      setIsProcessing(false);
      setRecordingDuration(0);
      return;
    }

    try {
      console.log('🚀 Creating session with text:', finalText);
      const session = await createSession(finalText, recordingDuration);
      console.log('✅ Session created:', session);
      console.log('🧭 Navigating to:', `/session/${session.id}`);
      navigate(`/session/${session.id}`);
    } catch (error) {
      console.error('❌ Failed to create session:', error);
      toast.error('Something went wrong. Please try again.');
      setIsProcessing(false);
      setRecordingDuration(0);
    }
  }, [
    isListening,
    transcript,
    interimTranscript,
    recordingDuration,
    stopListening,
    navigate,
  ]);

  const handleBack = () => {
    navigate(-1);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isListening, stopListening]);

  return (
    <div className="min-h-screen flex flex-col p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[calc(90px+env(safe-area-inset-bottom))] bg-background">
      {/* Back button (iOS style) */}
      {showBackButton && (
        <button
          className="inline-flex items-center gap-1 p-2 -ml-2 bg-transparent border-none text-primary cursor-pointer min-h-[44px] active:opacity-70"
          onClick={handleBack}
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="text-[17px]">Back</span>
        </button>
      )}

      {/* Main content - centered */}
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
        {/* Title */}
        <h1 className="text-[28px] font-bold leading-[34px] tracking-[0.36px] mb-8">
          What's on your mind?
        </h1>

        {/* Voice Button - Centered */}
        <VoiceButton
          isRecording={isListening}
          onPressStart={handlePressStart}
          onPressEnd={handlePressEnd}
          disabled={!isSupported}
          recordingDuration={recordingDuration}
        />

        {/* Hint text */}
        <p className="text-[13px] text-muted-foreground">
          {isListening
            ? "I'm listening..."
            : isProcessing
              ? 'Processing...'
              : 'Hold to speak'}
        </p>

        {/* Transcript preview - always reserve space */}
        <div
          className="max-w-[280px] p-3 px-4 bg-secondary rounded-xl mt-3 transition-opacity duration-200"
          style={{
            minHeight: '48px',
            opacity: transcript || interimTranscript ? 1 : 0,
          }}
        >
          <p className="text-[16px] leading-[21px] text-foreground m-0 italic">
            {transcript || interimTranscript || '\u00A0'}
          </p>
        </div>

        {/* Browser not supported */}
        {!isSupported && (
          <div className="mt-6 p-4 bg-orange-500/10 rounded-xl max-w-[280px]">
            <p className="text-[13px] leading-[18px] text-orange-600 m-0 text-center">
              Speech recognition is not supported in this browser.
              <br />
              Please use Chrome or Safari.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
