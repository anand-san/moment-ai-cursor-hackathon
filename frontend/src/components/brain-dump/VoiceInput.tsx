import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

interface VoiceInputProps {
  onTranscriptChange: (transcript: string) => void;
  disabled?: boolean;
}

export function VoiceInput({
  onTranscriptChange,
  disabled = false,
}: VoiceInputProps) {
  const {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText();

  useEffect(() => {
    if (transcript) {
      onTranscriptChange(transcript);
    }
  }, [transcript, onTranscriptChange]);

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4" />
        <span>Voice input is not supported in this browser</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant={isListening ? 'destructive' : 'outline'}
          size="lg"
          onClick={handleToggle}
          disabled={disabled}
          className="gap-2"
        >
          {isListening ? (
            <>
              <MicOff className="h-5 w-5" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-5 w-5" />
              Start Recording
            </>
          )}
        </Button>

        {isListening && (
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
            </span>
            <span className="text-sm text-destructive font-medium">
              Recording...
            </span>
          </div>
        )}
      </div>

      {interimTranscript && (
        <div className="p-3 rounded-lg bg-muted/50 border border-dashed border-muted-foreground/25">
          <p className="text-sm text-muted-foreground italic">
            {interimTranscript}
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>Error: {error}</span>
        </div>
      )}
    </div>
  );
}
