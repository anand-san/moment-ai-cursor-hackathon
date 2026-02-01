import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  TextInput,
  type TextInputRef,
} from '@/components/brain-dump/TextInput';
import { createSession } from '@/api/sessions';
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
      navigate(`/session/${session.id}`);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto z-10">
        {/* Static Title */}
        <h1 className="text-4xl font-bold text-center mb-16">
          What's on your mind?
        </h1>

        {/* Fixed Input Container - both modes overlay in this space */}
        <div className="relative w-full max-w-md h-[320px]">
          {/* Voice Mode - always positioned, opacity controlled */}
          <div
            className={cn(
              'absolute inset-0 flex flex-col items-center transition-opacity duration-300 ease-out',
              isTypingMode ? 'opacity-0 pointer-events-none' : 'opacity-100',
            )}
          >
            {/* Voice Button Container */}
            <div className="relative mb-12">
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
                    : 'bg-white dark:bg-zinc-800 text-primary hover:scale-105 border border-white/20 dark:border-white/10',
                )}
                onClick={toggleListening}
              >
                {isListening ? (
                  <AudioLines className="w-10 h-10 animate-pulse" />
                ) : (
                  <Mic className="w-10 h-10" />
                )}
              </Button>

              {/* Status Text */}
              <div className="absolute -bottom-10 left-0 right-0 text-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {isListening ? 'Tap to stop' : 'Tap to speak'}
                </span>
              </div>
            </div>

            {/* Live Transcription Display */}
            <div
              className={cn(
                'w-full max-w-sm min-h-[80px] transition-opacity duration-300 ease-out',
                isListening || transcript ? 'opacity-100' : 'opacity-0',
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

            {/* Keyboard Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'mt-4 rounded-full text-muted-foreground hover:text-primary transition-opacity duration-300 hover:bg-white/50',
                isListening ? 'opacity-0 pointer-events-none' : 'opacity-100',
              )}
              onClick={() => setIsTypingMode(true)}
            >
              <Keyboard className="w-6 h-6" />
            </Button>
          </div>

          {/* Typing Mode - always positioned, opacity controlled */}
          <div
            className={cn(
              'absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ease-out',
              isTypingMode ? 'opacity-100' : 'opacity-0 pointer-events-none',
            )}
          >
            <div className="w-full glass-card p-4">
              <TextInput
                ref={textInputRef}
                onSubmit={handleSubmit}
                placeholder="Type your thoughts..."
              />
            </div>

            {/* Cancel Button */}
            <Button
              variant="ghost"
              className="mt-4 text-sm text-muted-foreground"
              onClick={() => setIsTypingMode(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
