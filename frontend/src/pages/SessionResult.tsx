import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TipItem } from '@/components/tips/TipItem';
import { FullScreenLoader } from '@/components/loader';
import { getSession } from '@/api/sessions';
import {
  Home,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import type { SessionWithId, Tip } from '@sandilya-stack/shared/types';
import { motion } from 'framer-motion';

export default function SessionResult() {
  const { id } = useParams<{ id: string }>();

  const [session, setSession] = useState<SessionWithId | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchSession = async () => {
      try {
        const sessionData = await getSession(id);
        setSession(sessionData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load session');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
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
    <div className="min-h-screen flex flex-col p-6 max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Session Complete!</h1>
        <p className="text-muted-foreground">
          {helpfulTips.length > 0
            ? `You saved ${helpfulTips.length} helpful tip${helpfulTips.length > 1 ? 's' : ''} from this session.`
            : 'No tips saved from this session.'}
        </p>
      </motion.div>

      {/* Helpful tips */}
      {helpfulTips.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Your Helpful Tips
          </h2>
          <div className="space-y-4">
            {helpfulTips.map((tip, index) => (
              <TipItem key={tip.id} tip={tip} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-3 mt-auto pt-8">
        <Link to="/" className="block">
          <Button className="w-full gap-2" size="lg">
            <Home className="h-5 w-5" />
            Start New Session
          </Button>
        </Link>

        <Link to="/tips" className="block">
          <Button variant="outline" className="w-full gap-2" size="lg">
            <BookOpen className="h-5 w-5" />
            View All My Helpful Tips
          </Button>
        </Link>
      </div>
    </div>
  );
}
