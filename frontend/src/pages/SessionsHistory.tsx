import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FullScreenLoader } from '@/components/loader';
import { getAllSessions } from '@/api/sessions';
import {
  Home,
  AlertCircle,
  Inbox,
  ThumbsUp,
  ChevronRight,
  Brain,
} from 'lucide-react';
import type { SessionSummary } from '@sandilya-stack/shared/types';

export default function SessionsHistory() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchSessions = async () => {
      try {
        const response = await getAllSessions({
          signal: abortController.signal,
        });
        setSessions(response.sessions);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(
          err instanceof Error ? err.message : 'Failed to load sessions',
        );
        setIsLoading(false);
      }
    };

    fetchSessions();

    return () => {
      abortController.abort();
    };
  }, []);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

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
          Your past brain dumps and insights
        </p>
      </div>

      {/* Scrollable Content */}
      {sessions.length > 0 ? (
        <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-4">
          {sessions.map(session => (
            <Link
              key={session.id}
              className="block"
              to={
                session.hasAnalysis
                  ? `/session/${session.id}/result`
                  : `/session/${session.id}`
              }
            >
              <div className="group p-4 rounded-2xl border border-white/10 bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/40 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-2 leading-relaxed group-hover:text-primary transition-colors">
                      {truncateText(session.text)}
                    </p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                      <span>{formatDate(session.createdAt)}</span>
                      {session.helpfulTipsCount > 0 && (
                        <span className="flex items-center gap-1 text-green-600 bg-green-100/50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                          <ThumbsUp className="h-3 w-3" />
                          {session.helpfulTipsCount}
                        </span>
                      )}
                      {!session.hasAnalysis && (
                        <span className="flex items-center gap-1 text-amber-600 bg-amber-100/50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                          <Brain className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </div>
              </div>
            </Link>
          ))}
          {/* Stats footer */}
          <div className="pt-4 pb-2 text-center text-sm text-muted-foreground border-t border-border/30">
            {sessions.length} session{sessions.length > 1 ? 's' : ''} total
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
            <Inbox className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h2 className="text-xl font-medium mb-2">No sessions yet</h2>
          <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
            Start your first brain dump session to see your history here.
          </p>
        </div>
      )}
    </div>
  );
}
