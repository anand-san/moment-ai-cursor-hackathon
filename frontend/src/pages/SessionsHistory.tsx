import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FullScreenLoader } from '@/components/loader';
import { getAllSessions } from '@/api/sessions';
import {
  Home,
  Clock,
  AlertCircle,
  Inbox,
  ThumbsUp,
  ChevronRight,
  Brain,
} from 'lucide-react';
import type { SessionSummary } from '@sandilya-stack/shared/types';
import { motion } from 'framer-motion';

export default function SessionsHistory() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await getAllSessions();
        setSessions(response.sessions);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load sessions',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
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
          <Clock className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Session History</h1>
        </div>
        <p className="text-muted-foreground">
          Your past brain dump sessions and their outcomes.
        </p>
      </motion.div>

      {/* Sessions list */}
      {sessions.length > 0 ? (
        <div className="space-y-3">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                to={
                  session.hasAnalysis
                    ? `/session/${session.id}/result`
                    : `/session/${session.id}`
                }
              >
                <div className="p-4 rounded-xl border bg-card shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-2">
                        {truncateText(session.text)}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{formatDate(session.createdAt)}</span>
                        {session.helpfulTipsCount > 0 && (
                          <span className="flex items-center gap-1 text-green-600">
                            <ThumbsUp className="h-3 w-3" />
                            {session.helpfulTipsCount} helpful
                          </span>
                        )}
                        {!session.hasAnalysis && (
                          <span className="flex items-center gap-1 text-amber-600">
                            <Brain className="h-3 w-3" />
                            Not analyzed
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center py-12"
        >
          <Inbox className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-medium mb-2">No sessions yet</h2>
          <p className="text-muted-foreground mb-6 max-w-xs">
            Start your first brain dump session to see your history here.
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
      {sessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground"
        >
          <p>
            {sessions.length} session{sessions.length > 1 ? 's' : ''} total
          </p>
        </motion.div>
      )}
    </div>
  );
}
