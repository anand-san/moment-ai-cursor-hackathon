import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TipStack } from '@/components/tips/TipStack';
import { FullScreenLoader } from '@/components/loader';
import {
  getSession,
  analyzeSession,
  swipeTip,
  regenerateTips,
} from '@/api/sessions';
import { ArrowLeft, AlertCircle, Home } from 'lucide-react';
import type { SessionWithId, Analysis } from '@sandilya-stack/shared/types';

export default function SessionTips() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<SessionWithId | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch session data (handles direct URL access)
  useEffect(() => {
    if (!id) return;

    const fetchSession = async () => {
      try {
        const sessionData = await getSession(id);
        setSession(sessionData);

        if (sessionData.analysis) {
          setAnalysis(sessionData.analysis);
          setIsLoading(false);
        } else {
          // Analysis not ready yet, trigger it
          const analysisData = await analyzeSession(id);
          setAnalysis(analysisData);
          setIsLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load session');
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  const handleSwipe = useCallback(
    (tipId: string, direction: 'left' | 'right') => {
      if (!id) return;
      // Fire-and-forget: don't block UI on API response
      swipeTip(id, tipId, direction).catch(err => {
        console.error('Failed to record swipe:', err);
        // Silently fail - the UI has already moved on
      });
    },
    [id],
  );

  const handleRegenerate = useCallback(async () => {
    if (!id) return;
    const newAnalysis = await regenerateTips(id);
    setAnalysis(newAnalysis);
  }, [id]);

  const handleComplete = useCallback(() => {
    if (!id) return;
    navigate(`/session/${id}/result`);
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <FullScreenLoader />
        <p className="mt-4 text-muted-foreground">Loading tips...</p>
      </div>
    );
  }

  if (error || !session || !analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="flex items-center gap-2 text-destructive mb-4">
          <AlertCircle className="h-6 w-6" />
          <span className="text-lg">{error || 'Session not found'}</span>
        </div>
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  // Filter out already swiped tips
  const unswipedTips = analysis.tips.filter(tip => tip.swipeDirection === null);

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-lg mx-auto relative z-10">
      {/* Back button */}
      <div className="mb-4">
        <Link to={`/session/${id}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Tips heading */}
      <h2 className="text-xl font-semibold mb-6 text-center">Tips for you</h2>

      {/* Tip stack */}
      <div className="flex-1 flex flex-col justify-center">
        <TipStack
          tips={unswipedTips}
          onSwipe={handleSwipe}
          onRegenerate={handleRegenerate}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}
