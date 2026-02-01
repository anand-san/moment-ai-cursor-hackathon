import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TipItem } from '@/components/tips/TipItem';
import { FullScreenLoader } from '@/components/loader';
import { getSession } from '@/api/sessions';
import {
  Home,
  BookOpen,
  AlertCircle,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import type { SessionWithId, Tip } from '@sandilya-stack/shared/types';

export default function SessionResult() {
  const { id } = useParams<{ id: string }>();

  const [session, setSession] = useState<SessionWithId | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const abortController = new AbortController();

    const fetchSession = async () => {
      try {
        const sessionData = await getSession(id, {
          signal: abortController.signal,
        });
        setSession(sessionData);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Failed to load session');
        setIsLoading(false);
      }
    };

    fetchSession();

    return () => {
      abortController.abort();
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <FullScreenLoader />
      </div>
    );
  }

  if (error || !session) {
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

  // Get all right-swiped tips from current analysis and previous tips
  const helpfulTips: Tip[] = [];

  if (session.analysis) {
    helpfulTips.push(
      ...session.analysis.tips.filter(tip => tip.swipeDirection === 'right'),
    );
  }

  for (const batch of session.previousTips) {
    helpfulTips.push(
      ...batch.tips.filter(tip => tip.swipeDirection === 'right'),
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-lg mx-auto relative z-10">
      {/* Back button */}
      <div className="mb-4">
        <Link to={`/session/${id}/tips`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      {helpfulTips.length > 0 ? (
        <>
          {/* Description */}
          <p className="text-muted-foreground text-lg text-center mb-6">
            You saved {helpfulTips.length} helpful tip
            {helpfulTips.length > 1 ? 's' : ''} from this session.
          </p>

          {/* Helpful tips */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
              Your Helpful Tips
            </h2>
            <div className="space-y-4">
              {helpfulTips.map(tip => (
                <TipItem key={tip.id} tip={tip} />
              ))}
            </div>
          </div>
        </>
      ) : (
        /* No tips - center the message */
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-lg text-center">
            No tips saved from this session.
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-4 mt-auto pt-8">
        <Link to="/" className="block">
          <Button className="w-full gap-2 h-12 text-base rounded-xl" size="lg">
            <Home className="h-5 w-5" />
            Start New Session
          </Button>
        </Link>

        <Link to="/tips" className="block">
          <Button
            variant="outline"
            className="w-full gap-2 h-12 text-base rounded-xl border-primary/20"
            size="lg"
          >
            <BookOpen className="h-5 w-5" />
            View All My Helpful Tips
          </Button>
        </Link>
      </div>
    </div>
  );
}
