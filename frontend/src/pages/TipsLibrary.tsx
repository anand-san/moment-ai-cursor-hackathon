import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TipItem } from '@/components/tips/TipItem';
import { FullScreenLoader } from '@/components/loader';
import { getValuableTips } from '@/api/sessions';
import { Home, AlertCircle, Inbox } from 'lucide-react';
import type { ValuableTip } from '@sandilya-stack/shared/types';

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
    <div className="h-[calc(100vh-5rem)] flex flex-col p-6 max-w-lg mx-auto relative z-10">
      {/* Header */}
      <div className="flex-shrink-0 pb-6">
        <p className="text-muted-foreground text-center">
          Collection of insights from your sessions
        </p>
      </div>

      {/* Scrollable Content */}
      {tips.length > 0 ? (
        <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-4">
          {tips.map(tip => (
            <TipItem key={`${tip.sessionId}-${tip.id}`} tip={tip} showContext />
          ))}
          {/* Stats footer */}
          <div className="pt-4 pb-2 text-center text-sm text-muted-foreground border-t border-border/30">
            {tips.length} helpful tip{tips.length > 1 ? 's' : ''} saved
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
            <Inbox className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h2 className="text-xl font-medium mb-2">No tips saved yet</h2>
          <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
            Start a brain dump session and swipe right on tips that resonate
            with you.
          </p>
        </div>
      )}
    </div>
  );
}
