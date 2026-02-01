import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  TextInput,
  type TextInputRef,
} from '@/components/brain-dump/TextInput';
import { createSession, analyzeSession } from '@/api/sessions';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { Mic, AudioLines, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const navigate = useNavigate();
  const textInputRef = useRef<TextInputRef>(null);
  const [isTypingMode, setIsTypingMode] = useState(false);

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText();

  // Handle transcript updates
  useEffect(() => {
    if (transcript && textInputRef.current) {
      textInputRef.current.setText(transcript);
    }
  }, [transcript]);

  // Auto-submit when listening stops
  const wasListeningRef = useRef(false);
  useEffect(() => {
    if (wasListeningRef.current && !isListening) {
      if (transcript.trim().length > 0) {
        handleSubmit(transcript);
      }
    }
    wasListeningRef.current = isListening;
  }, [isListening, transcript]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
      setIsTypingMode(false);
    }
  };

  const handleSubmit = async (text: string) => {
    try {
      const session = await createSession(text);
      analyzeSession(session.id);
      navigate(`/session/${session.id}`);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto z-10 transition-all duration-500 ease-in-out">
        {/* Dynamic Header */}
        <h1
          className={cn(
            'text-4xl font-bold text-center mb-16 transition-all duration-300',
            isListening ? 'scale-90 opacity-80' : 'scale-100',
          )}
        >
          {isListening ? "I'm listening..." : "What's on your mind?"}
        </h1>

        {/* Voice Trigger / Visualization - hidden in typing mode */}
        <div
          className={cn(
            'relative mb-12 transition-all duration-500 ease-in-out',
            isTypingMode
              ? 'opacity-0 -translate-y-10 pointer-events-none absolute'
              : 'opacity-100 translate-y-0',
          )}
        >
          {/* Ripple Effects when listening */}
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75 pointer-events-none" />
              <div className="absolute inset-[-12px] rounded-full bg-primary/10 animate-pulse delay-75 pointer-events-none" />
            </>
          )}

          <Button
            size="lg"
            variant="ghost"
            className={cn(
              'rounded-full w-24 h-24 flex items-center justify-center transition-all duration-300 shadow-xl',
              isListening
                ? 'bg-primary/20 text-primary border-2 border-primary/30'
                : 'bg-white dark:bg-zinc-800 text-primary  hover:scale-105 border border-white/20 dark:border-white/10',
            )}
            onClick={toggleListening}
          >
            {isListening ? (
              <AudioLines className="w-10 h-10 animate-pulse" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </Button>

          {/* Timer or Status Text */}
          <div className="absolute -bottom-10 left-0 right-0 text-center">
            <span className="text-sm font-medium text-muted-foreground">
              {isListening ? 'Tap to stop' : 'Tap to speak'}
            </span>
          </div>
        </div>

        {/* Live Transcription Display */}
        <div
          className={cn(
            'w-full max-w-sm min-h-[80px] transition-all duration-500 ease-out',
            isListening || transcript
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4',
          )}
        >
          {(isListening || transcript) && (
            <div className="px-6 py-4">
              <p className="text-center text-lg leading-relaxed">
                {transcript && (
                  <span className="text-foreground">{transcript}</span>
                )}
                {interimTranscript && (
                  <span className="text-muted-foreground/70 italic">
                    {transcript ? ' ' : ''}
                    {interimTranscript}
                  </span>
                )}
                {isListening && !transcript && !interimTranscript && (
                  <span className="text-muted-foreground/50 animate-pulse">
                    Start speaking...
                  </span>
                )}
              </p>

              {/* Typing indicator dots when listening */}
              {isListening && (transcript || interimTranscript) && (
                <div className="flex justify-center gap-1 mt-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Text Input Toggle / Area */}
        <div
          className={cn(
            'w-full max-w-md transition-all duration-500 ease-in-out',
            isTypingMode
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10 pointer-events-none absolute bottom-0',
          )}
        >
          <div className="glass-card p-4">
            <TextInput
              ref={textInputRef}
              onSubmit={handleSubmit}
              placeholder="Type your thoughts..."
            />
          </div>
        </div>

        {/* Keyboard Toggle (only visible when not typing) */}
        {!isTypingMode && !isListening && (
          <Button
            variant="ghost"
            size="icon"
            className="mt-8 rounded-full text-muted-foreground hover:text-primary transition-colors hover:bg-white/50"
            onClick={() => setIsTypingMode(true)}
          >
            <Keyboard className="w-6 h-6" />
          </Button>
        )}

        {/* Cancel Typing Mode */}
        {isTypingMode && (
          <Button
            variant="ghost"
            className="mt-4 text-sm text-muted-foreground"
            onClick={() => setIsTypingMode(false)}
          >
            Cancel
          </Button>
        )}
      </main>
    </div>
  );
}
