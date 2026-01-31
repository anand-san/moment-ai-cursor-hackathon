import { useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  TextInput,
  type TextInputRef,
} from '@/components/brain-dump/TextInput';
import { VoiceInput } from '@/components/brain-dump/VoiceInput';
import { createSession, analyzeSession } from '@/api/sessions';
import { useAuth } from '@/context/auth/AuthContextProvider';
import { BookOpen, Brain, Sparkles, Clock } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const textInputRef = useRef<TextInputRef>(null);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');

  const handleTranscriptChange = useCallback((transcript: string) => {
    if (textInputRef.current) {
      textInputRef.current.setText(transcript);
    }
  }, []);

  const handleSubmit = async (text: string) => {
    // Create session
    const session = await createSession(text);

    // Start analysis in background (we'll fetch results on session page)
    analyzeSession(session.id);

    // Navigate to session page
    navigate(`/session/${session.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold">Brain Dump</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Hey {user?.displayName?.split(' ')[0] || 'there'}! What&apos;s on
            your mind?
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Let it all out - no judgment, just support.
          </p>
        </div>

        {/* Input mode toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={inputMode === 'text' ? 'default' : 'outline'}
            onClick={() => setInputMode('text')}
            size="sm"
          >
            Type it out
          </Button>
          <Button
            variant={inputMode === 'voice' ? 'default' : 'outline'}
            onClick={() => setInputMode('voice')}
            size="sm"
          >
            Talk it out
          </Button>
        </div>

        {/* Voice input (shows when voice mode active) */}
        {inputMode === 'voice' && (
          <div className="w-full mb-4">
            <VoiceInput onTranscriptChange={handleTranscriptChange} />
          </div>
        )}

        {/* Text input (always visible, receives voice transcript) */}
        <TextInput ref={textInputRef} onSubmit={handleSubmit} />

        {/* Navigation links */}
        <div className="mt-8 pt-8 border-t border-border w-full space-y-2">
          <Link to="/sessions">
            <Button variant="ghost" className="w-full gap-2">
              <Clock className="h-5 w-5" />
              View Session History
            </Button>
          </Link>
          <Link to="/tips">
            <Button variant="ghost" className="w-full gap-2">
              <BookOpen className="h-5 w-5" />
              View My Helpful Tips Library
              <Sparkles className="h-4 w-4 text-primary" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
