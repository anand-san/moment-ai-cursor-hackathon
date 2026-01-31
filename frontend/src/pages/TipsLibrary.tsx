import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TipItem } from '@/components/tips/TipItem';
import { FullScreenLoader } from '@/components/loader';
import { getValuableTips } from '@/api/sessions';
import { Home, BookOpen, AlertCircle, Inbox } from 'lucide-react';
import type { ValuableTip } from '@sandilya-stack/shared/types';
import { motion } from 'framer-motion';

export default function TipsLibrary() {
  const [tips, setTips] = useState<ValuableTip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await getValuableTips();
        setTips(response.tips);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tips');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTips();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <FullScreenLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="flex items-center gap-2 text-destructive mb-4">
          <AlertCircle className="h-6 w-6" />
          <span className="text-lg">{error}</span>
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

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-lg mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <Home className="h-4 w-4" />
            Home
          </Button>
        </Link>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Your Helpful Tips Library</h1>
        </div>
        <p className="text-muted-foreground">
          All the tips you found helpful across your sessions.
        </p>
      </motion.div>

      {/* Tips list */}
      {tips.length > 0 ? (
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <TipItem
              key={`${tip.sessionId}-${tip.id}`}
              tip={tip}
              showContext
              index={index}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center py-12"
        >
          <Inbox className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-medium mb-2">No tips saved yet</h2>
          <p className="text-muted-foreground mb-6 max-w-xs">
            Start a brain dump session and swipe right on tips that resonate
            with you.
          </p>
          <Link to="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Start a Session
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Stats footer */}
      {tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground"
        >
          <p>
            {tips.length} helpful tip{tips.length > 1 ? 's' : ''} saved
          </p>
        </motion.div>
      )}
    </div>
  );
}
